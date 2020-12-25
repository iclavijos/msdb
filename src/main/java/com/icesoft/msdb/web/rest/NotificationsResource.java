package com.icesoft.msdb.web.rest;

import com.icesoft.msdb.security.AuthoritiesConstants;
import com.icesoft.msdb.service.SearchService;
import com.icesoft.msdb.service.SubscriptionsService;
import io.micrometer.core.annotation.Timed;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.async.DeferredResult;

import java.util.concurrent.ForkJoinPool;

/**
 * Controller for view and managing Log Level at runtime.
 */
@RestController
@Slf4j
public class NotificationsResource {

	private final SubscriptionsService subscriptionsService;

	public NotificationsResource(SubscriptionsService subscriptionsService) {
		this.subscriptionsService = subscriptionsService;
	}

    @PutMapping("/management/notifications/rebuild")
    @Secured({AuthoritiesConstants.ADMIN})
    @Timed
    public DeferredResult<ResponseEntity<Void>> rebuildNotificationsSessions() {
    	log.debug("REST request to rebuild notifications sessions");
        DeferredResult<ResponseEntity<Void>> output = new DeferredResult<>(1800000L);

        output.onError((Throwable t) -> {
            log.error("Could not regenerate indexes", t);
            output.setErrorResult(
                ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(t.getLocalizedMessage()));
        });

        ForkJoinPool.commonPool().submit(() -> {
            subscriptionsService.rebuildSessionsData();
            log.info("Sessions data rebuilt...");
            output.setResult(ResponseEntity.ok().build());
        });

        return output;
    }

}
