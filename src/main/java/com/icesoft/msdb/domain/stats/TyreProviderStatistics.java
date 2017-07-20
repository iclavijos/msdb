package com.icesoft.msdb.domain.stats;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="tyreProviderStatistics")
public class TyreProviderStatistics extends ElementStatistics {

	@Id
	private String tyreProvId;
	
	public TyreProviderStatistics(String tyreProvId) {
		this.tyreProvId = tyreProvId;
	}
}
