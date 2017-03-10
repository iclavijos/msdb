package com.icesoft.msdb.web.rest;

import java.net.URISyntaxException;
import java.time.LocalDate;
import java.util.List;

import javax.transaction.Transactional;
import javax.validation.Valid;
import javax.xml.bind.DatatypeConverter;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;
import com.fasterxml.jackson.databind.MappingIterator;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.icesoft.msdb.MSDBException;
import com.icesoft.msdb.domain.Driver;
import com.icesoft.msdb.domain.ImportType;
import com.icesoft.msdb.domain.Imports;
import com.icesoft.msdb.domain.Racetrack;
import com.icesoft.msdb.domain.RacetrackLayout;
import com.icesoft.msdb.domain.serializer.ParseDeserializer;
import com.icesoft.msdb.repository.DriverRepository;
import com.icesoft.msdb.repository.RacetrackLayoutRepository;
import com.icesoft.msdb.repository.RacetrackRepository;
import com.icesoft.msdb.service.dto.RacetrackWithLayoutsImportDTO;

/**
 * REST controller for managing CSV imports
 */
@RestController
@RequestMapping("/api")
public class ImportsResource {

    private final Logger log = LoggerFactory.getLogger(ImportsResource.class);

    @Autowired private DriverRepository driversRepository;
    @Autowired private RacetrackRepository racetrackRepository;
    @Autowired private RacetrackLayoutRepository racetrackLayoutRepository;

    @PostMapping("/imports")
    @Timed
    @Transactional
    public ResponseEntity<?> importCSV(@Valid @RequestBody Imports imports) throws URISyntaxException {
        log.debug("REST request to import CSV contents : {}", imports.getImportType());
        
        String data = new String(DatatypeConverter.parseBase64Binary(imports.getCsvContents()));
        try {
	        switch(imports.getImportType()) {
	        	case DRIVERS: importDrivers(data); break;
	        	case RACETRACKS: importRacetracks(data); break;
	        	default: log.warn("The uploaded file does not correspond to any known entity");
	        }
        } catch (MSDBException e) {
        	HttpHeaders textPlainHeaders = new HttpHeaders();
            textPlainHeaders.setContentType(MediaType.TEXT_PLAIN);
        	return new ResponseEntity<>("imports.fail", textPlainHeaders, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
        return new ResponseEntity<>("File uploaded", HttpStatus.ACCEPTED);
    }
    
    private <T> MappingIterator<T> initializeIterator(T type, String data) {
    	CsvSchema bootstrapSchema = CsvSchema.emptySchema().withHeader().withColumnSeparator(';');
        CsvMapper mapper = new CsvMapper();
        try {
        	JavaTimeModule javaTimeModule=new JavaTimeModule();
            javaTimeModule.addDeserializer(LocalDate.class, new ParseDeserializer());
            mapper.registerModule(javaTimeModule);
	        return mapper.readerFor(type.getClass()).with(bootstrapSchema).readValues(data);
	        
        } catch (Exception e) {
        	log.error("Problem processing uploaded CSV data", e);
        	throw new MSDBException(e);
        }
        	
    }
    
    private void importDrivers(String data) {
    	MappingIterator<Driver> readValues = initializeIterator(new Driver(), data);
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
        
    }
    
    private void importRacetracks(String data) {
    	MappingIterator<RacetrackWithLayoutsImportDTO> readValues = initializeIterator(new RacetrackWithLayoutsImportDTO(), data);
        Racetrack racetrack = null;
        while (readValues.hasNext()) {
        	RacetrackWithLayoutsImportDTO tmp = readValues.next();
        	if (StringUtils.isNotBlank(tmp.getRacetrackName())) {
        		//New racetrack
        		racetrack = new Racetrack();
	        	racetrack.setName(tmp.getRacetrackName());
	        	racetrack.setLocation(tmp.getLocation());
        		Racetrack found = racetrackRepository.findOne(Example.of(racetrack));
        		if (found != null) {
        			racetrack = found;
        		} else {
        			racetrack = racetrackRepository.save(racetrack);
        		}
        	}
        	RacetrackLayout layout = new RacetrackLayout();
        	layout.setName(tmp.getLayoutName());
        	layout.setLength(tmp.getLength());
        	layout.setYearFirstUse(tmp.getYearFirstUse());
        	layout.setActive(tmp.isActive());
        	
        	RacetrackLayout found = racetrackLayoutRepository.findOne(Example.of(layout));
        	if (found == null) {
        		layout.setRacetrack(racetrack);
        		racetrackLayoutRepository.save(layout);
        	} else {
        		//Do nothing
        		log.warn("Skipping racetrack layout {} - already exists", layout);
        	}
        	
        }
    }

}
