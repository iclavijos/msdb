package com.icesoft.msdb.web.rest.errors;

import static org.springframework.core.annotation.AnnotatedElementUtils.findMergedAnnotation;

import java.net.URI;
import java.nio.file.AccessDeniedException;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.annotation.Nullable;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.dao.ConcurrencyFailureException;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageConversionException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import tech.jhipster.config.JHipsterConstants;
import tech.jhipster.web.rest.errors.ProblemDetailWithCause;
import tech.jhipster.web.util.HeaderUtil;

/**
 * Controller advice to translate the server side exceptions to client-friendly json structures.
 * The error response follows RFC7807 - Problem Details for HTTP APIs (https://tools.ietf.org/html/rfc7807).
 */
@ControllerAdvice
public class ExceptionTranslator extends ResponseEntityExceptionHandler {

    private static final String FIELD_ERRORS_KEY = "fieldErrors";
    private static final String MESSAGE_KEY = "message";
    private static final String PATH_KEY = "path";
    private static final String VIOLATIONS_KEY = "violations";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final Environment env;

    public ExceptionTranslator(Environment env) {
        this.env = env;
    }

    @ExceptionHandler
    public ResponseEntity<Object> handleAnyException(Throwable ex, NativeWebRequest request
    ) {
        ProblemDetailWithCause pdCause = wrapAndCustemizeProblem(ex, request);
        return handleExceptionInternal((Exception) ex, pdCause, buildHeaders(ex, request), HttpStatusCode.valueOf(pdCause.getStatus()), request);
    }

    @Nullable
    @Override
    protected ResponseEntity<Object> handleExceptionInternal(
        Exception ex, @Nullable Object body, HttpHeaders headers, HttpStatusCode statusCode, WebRequest request) {
        body = body == null ? wrapAndCustemizeProblem((Throwable) ex, (NativeWebRequest) request) : body;
        return super.handleExceptionInternal(ex, body, headers, statusCode, request);
    }

    protected ProblemDetailWithCause wrapAndCustemizeProblem(Throwable ex, NativeWebRequest request) {
        return custemizeProblem(getProblemDetailWithCause(ex), ex, request);
    }

    private ProblemDetailWithCause getProblemDetailWithCause(Throwable ex) {
//        if(ex instanceof com.icesoft.msdb.service.EmailAlreadyUsedException)
//        return new EmailAlreadyUsedException().getProblemDetailWithCause();
//        if(ex instanceof com.icesoft.msdb.service.UsernameAlreadyUsedException )
//        return new LoginAlreadyUsedException().getProblemDetailWithCause();
//        if(ex instanceof com.icesoft.msdb.service.InvalidPasswordException )
//        return (ProblemDetailWithCause) new InvalidPasswordException().getBody();
//        if(ex instanceof ErrorResponseException exp && exp.getBody() instanceof ProblemDetailWithCause)
//            return (ProblemDetailWithCause) exp.getBody();
        return ProblemDetailWithCause.ProblemDetailWithCauseBuilder.instance().withStatus(toStatus(ex).value()).build();
    }

    protected ProblemDetailWithCause custemizeProblem(ProblemDetailWithCause problem, Throwable err, NativeWebRequest request) {
        if (problem.getStatus() <= 0) problem.setStatus(toStatus(err));

        if (problem.getType() == null || problem.getType().equals(URI.create("about:blank"))) problem.setType(getMappedType(err));

        // higher precedence to Custom/ResponseStatus types
        String title = extractTitle(err, problem.getStatus());
        if (problem.getTitle() == null || !problem.getTitle().equals(title)) {
            problem.setTitle(title);
        }

        if (problem.getDetail() == null) {
            // higher precedence to cause
            problem.setDetail(getCustemizedErrorDetails(err));
        }

        if (problem.getProperties() == null || !problem.getProperties().containsKey(MESSAGE_KEY))
            problem.setProperty(MESSAGE_KEY,
                getMappedMessageKey((Throwable) err) != null
                    ? getMappedMessageKey(err)
                    : "error.http." + problem.getStatus());

        if (problem.getProperties() == null || !problem.getProperties().containsKey(PATH_KEY))
            problem.setProperty(PATH_KEY, getPathValue(request));

        if((err instanceof MethodArgumentNotValidException) &&
        (problem.getProperties() == null || !problem.getProperties().containsKey(FIELD_ERRORS_KEY)))
        problem.setProperty(FIELD_ERRORS_KEY, getFieldErrors((MethodArgumentNotValidException) err));

        problem.setCause(buildCause(err.getCause(), request).orElse(null));

        return problem;
    }

    private String extractTitle(Throwable err, int statusCode) {
        return getCustemizedTitle(err) != null ? getCustemizedTitle(err) : extractTitleForResponseStatus(err, statusCode);
    }

    private List<FieldErrorVM> getFieldErrors(MethodArgumentNotValidException ex) {
        return ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(f ->
                new FieldErrorVM(
                    f.getObjectName().replaceFirst("<%= dtoSuffix %>$", ""),
                    f.getField(),
                    StringUtils.isNotBlank(f.getDefaultMessage()) ? f.getDefaultMessage() : f.getCode()
                )
            )
            .collect(Collectors.toList());
    }

    private String extractTitleForResponseStatus(Throwable err, int statusCode) {
        ResponseStatus specialStatus = extractResponseStatus(err);
        String title = specialStatus == null ? HttpStatus.valueOf(statusCode).getReasonPhrase() : specialStatus.reason();
        return title;
    }

    private String extractURI(NativeWebRequest request) {
        HttpServletRequest nativeRequest = request.getNativeRequest(HttpServletRequest.class);
        String requestUri = nativeRequest != null ? nativeRequest.getRequestURI() : StringUtils.EMPTY;
        return requestUri;
    }

    private HttpStatus toStatus(final Throwable throwable) {
        // Let the ErrorResponse take this responsibility
        if (throwable instanceof ErrorResponse err) return HttpStatus.valueOf(err.getBody().getStatus());

        return Optional
            .ofNullable(getMappedStatus(throwable))
            .orElse(Optional
                .ofNullable(resolveResponseStatus(throwable))
                .map(response -> response.value())
                .orElse(HttpStatus.INTERNAL_SERVER_ERROR));
    }

    private ResponseStatus extractResponseStatus(final Throwable throwable) {
        return Optional.ofNullable(resolveResponseStatus(throwable))
            .orElse(null);
    }

    private ResponseStatus resolveResponseStatus(final Throwable type) {
        final ResponseStatus candidate = findMergedAnnotation(type.getClass(), ResponseStatus.class);
        return candidate == null && type.getCause() != null ? resolveResponseStatus(type.getCause()) : candidate;
    }

    private URI getMappedType(Throwable err) {
        if(err instanceof MethodArgumentNotValidException exp)
            return ErrorConstants.CONSTRAINT_VIOLATION_TYPE;
        return ErrorConstants.DEFAULT_TYPE;
    }

    private String getMappedMessageKey(Throwable err) {
        if(err instanceof MethodArgumentNotValidException)
            return ErrorConstants.ERR_VALIDATION;

        else if(err instanceof ConcurrencyFailureException
                || err.getCause() != null && err.getCause() instanceof ConcurrencyFailureException)
                return ErrorConstants.ERR_CONCURRENCY_FAILURE;

        return null;
    }

    private String getCustemizedTitle(Throwable err) {
        if(err instanceof MethodArgumentNotValidException exp)
            return "Method argument not valid";
        return null;
    }

    private String getCustemizedErrorDetails(Throwable err) {
        Collection<String> activeProfiles = Arrays.asList(env.getActiveProfiles());
        if (activeProfiles.contains(JHipsterConstants.SPRING_PROFILE_PRODUCTION)) {
            if (err instanceof HttpMessageConversionException) return "Unable to convert http message";

            if (err instanceof DataAccessException) return "Failure during data access";

            if (containsPackageName(err.getMessage())) return "Unexpected runtime exception";
        }
        return err.getCause() != null ? err.getCause().getMessage() : err.getMessage();
    }

    private HttpStatus getMappedStatus(Throwable err) {
        // Where we disagree with Spring defaults
        if (err instanceof AccessDeniedException accDenied) return HttpStatus.FORBIDDEN;

        if(err instanceof ConcurrencyFailureException) return HttpStatus.CONFLICT;

        if(err instanceof BadCredentialsException) return HttpStatus.UNAUTHORIZED;

        return null;
    }

    private URI getPathValue(NativeWebRequest request) {
        if(request == null) return URI.create("about:blank");
        return URI.create(extractURI((NativeWebRequest) request));
    }

    private HttpHeaders buildHeaders(Throwable err, NativeWebRequest request) {
        return err instanceof BadRequestAlertException ?
            HeaderUtil.createFailureAlert(applicationName, true, ((BadRequestAlertException) err).getEntityName(),
                ((BadRequestAlertException) err).getErrorKey(), ((BadRequestAlertException) err).getMessage()) : null;
    }

    public Optional<ProblemDetailWithCause> buildCause(final Throwable throwable, NativeWebRequest request) {
        if(throwable != null && isCasualChainEnabled()) {
            return Optional.of(custemizeProblem(getProblemDetailWithCause(throwable), throwable, request));
        }
        return Optional.ofNullable(null);
    }

    private boolean isCasualChainEnabled() {
        // Customize as per the needs
        return false;
    }

    private boolean containsPackageName(String message) {

        // This list is for sure not complete
        return StringUtils.containsAny(message, "org.", "java.", "net.", "jakarta.", "javax.", "com.", "io.", "de.", "com.icesoft.msdb");
    }
}
