package com.icesoft.msdb.domain;


public class DriverPerformance {

    private final String driverName;
    private String category;
    private Double min;
    private Double q1;
    private Double mean;
    private Double q3;
    private Double max;

    public DriverPerformance(String driverName) {
        this.driverName = driverName;
    }

    public String getDriverName() {
        return driverName;
    }

    public String getCategory() {
        return category;
    }

    protected void setCategory(String category) {
        this.category = category;
    }

    protected void setMin(Double min) {
        this.min = min;
    }

    protected void setQ1(Double q1) {
        this.q1 = q1;
    }

    protected void setMean(Double mean) {
        this.mean = mean;
    }

    protected void setQ3(Double q3) {
        this.q3 = q3;
    }

    protected void setMax(Double max) {
        this.max = max;
    }

    public Double getMin() {
        return min;
    }

    public Double getQ1() {
        return q1;
    }

    public Double getMean() {
        return mean;
    }

    public Double getQ3() {
        return q3;
    }

    public Double getMax() {
        return max;
    }
}
