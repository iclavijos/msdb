package com.icesoft.msdb.domain;

public class Imports {
	private String csvContents;
	private ImportType importType;
	private Long associatedId;
	
	public String getCsvContents() {
		return csvContents;
	}
	public void setCsvContents(String csvContents) {
		this.csvContents = csvContents;
	}
	public ImportType getImportType() {
		return importType;
	}
	public void setImportType(ImportType importType) {
		this.importType = importType;
	}
	public Long getAssociatedId() {
		return associatedId;
	}
	public void setAssociatedId(Long associatedId) {
		this.associatedId = associatedId;
	}
}
