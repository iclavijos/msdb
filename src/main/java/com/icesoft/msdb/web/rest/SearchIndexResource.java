package com.icesoft.msdb.web.rest;

import java.net.URISyntaxException;
import java.util.List;
import java.util.concurrent.ForkJoinPool;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.micrometer.core.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.icesoft.msdb.security.AuthoritiesConstants;
import com.icesoft.msdb.service.SearchService;
import com.icesoft.msdb.service.dto.EventEntrySearchResultDTO;
import org.springframework.web.context.request.async.DeferredResult;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

/**
 * Controller for view and managing Log Level at runtime.
 */
@RestController
public class SearchIndexResource {

	private final Logger log = LoggerFactory.getLogger(SearchIndexResource.class);

	private final SearchService searchService;

	public SearchIndexResource(SearchService searchService) {
		this.searchService = searchService;
	}

    @PutMapping("/management/indexes/rebuild")
    @Secured({AuthoritiesConstants.ADMIN})
    @Timed
    public DeferredResult<ResponseEntity<Void>> rebuildSearchIndexes() {
    	log.debug("REST request to rebuild search indexes");
        DeferredResult<ResponseEntity<Void>> output = new DeferredResult<>(600000L);

        output.onError((Throwable t) -> {
            log.error("Could not regenerate indexes", t);
            output.setErrorResult(
                ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(t.getLocalizedMessage()));
        });

        ForkJoinPool.commonPool().submit(() -> {
            searchService.rebuildIndexes();
            log.info("Indexes rebuilt...");
            output.setResult(ResponseEntity.ok().build());
        });

        return output;
    }

    @GetMapping("/api/search/entries")
    @Timed
    public ResponseEntity<List<EventEntrySearchResultDTO>> searchEntries(@RequestParam String query, Pageable pageable) throws URISyntaxException {
    	log.debug(String.format("REST request to search entries for '%s", query));
    	Page<EventEntrySearchResultDTO> page = searchService.searchEntries(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
