package com.icesoft.msdb.web.rest;

import java.net.URISyntaxException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import javax.transaction.Transactional;
import javax.validation.Valid;
import javax.xml.bind.DatatypeConverter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;
import com.fasterxml.jackson.databind.DeserializationConfig;
import com.fasterxml.jackson.databind.MappingIterator;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.icesoft.msdb.MSDBException;
import com.icesoft.msdb.domain.Driver;
import com.icesoft.msdb.domain.Imports;
import com.icesoft.msdb.domain.serializer.ParseDeserializer;
import com.icesoft.msdb.repository.DriverRepository;

/**
 * REST controller for managing CSV imports
 */
@RestController
@RequestMapping("/api")
public class ImportsResource {

    private final Logger log = LoggerFactory.getLogger(ImportsResource.class);

    private final DriverRepository driversRepository;

    public ImportsResource(DriverRepository driversRepository) {
        this.driversRepository = driversRepository;
    }

    @PostMapping("/imports")
    @Timed
    @Async
    @Transactional
    public ResponseEntity<?> importCSV(@Valid @RequestBody Imports imports) throws URISyntaxException {
        log.debug("REST request to import CSV contents : {}", imports.getImportType());
        
        if (imports.getImportType().equals("drivers")) {
        	importDrivers(imports.getCsvContents());
        }
        
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }
    
    private void importDrivers(String encodedData) {
    	CsvSchema bootstrapSchema = CsvSchema.emptySchema().withHeader().withColumnSeparator(';');
        CsvMapper mapper = new CsvMapper();
        try {
        	String data = new String(DatatypeConverter.parseBase64Binary(encodedData));
        	JavaTimeModule javaTimeModule=new JavaTimeModule();
            // Hack time module to allow 'Z' at the end of string (i.e. javascript json's) 
            javaTimeModule.addDeserializer(LocalDate.class, new ParseDeserializer());
            mapper.registerModule(javaTimeModule);
	        MappingIterator<Driver> readValues = mapper.readerFor(Driver.class)
	        		.with(bootstrapSchema)
	        		.readValues(data);
	        while (readValues.hasNext()) {
	        	Driver driver = readValues.next();
	        	if (driversRepository.findByNameAndSurnameAndBirthDateAllIgnoreCase(
	        			driver.getName(), driver.getSurname(), driver.getBirthDate()).isEmpty()) {
		        	log.debug("Importing driver: {}", driver);
		        	driversRepository.save(driver);
	        	} else {
	        		log.warn("Driver {} already exist in the database. Skipping...", driver);
	        	}
	        }
        } catch (Exception e) {
        	log.error("Problem processing uploaded CSV data", e);
        	throw new MSDBException(e);
        }
    }

}
