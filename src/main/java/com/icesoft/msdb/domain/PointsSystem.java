package com.icesoft.msdb.domain;

import javax.persistence.*;
import javax.validation.constraints.*;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.util.Objects;

/**
 * A PointsSystem.
 */
@Entity
@Table(name = "points_system")
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "pointssystem")
@Data
@EqualsAndHashCode(callSuper = false)
public class PointsSystem extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @NotNull
    @Size(max = 50)
    @Column(name = "name", length = 50, nullable = false)
    @Field(type = FieldType.Keyword, normalizer = "lowercase")
    private String name;

    @Size(max = 100)
    @Column(name = "description", length = 100)
    @Field(type = FieldType.Keyword, normalizer = "lowercase")
    private String description;

    @Column(name = "points")
    private String points;

    @Column(name = "points_most_lead_laps")
    private Integer pointsMostLeadLaps;

    @Column(name = "points_pole")
    private Integer pointsPole;

    @Column(name = "points_lead_lap")
    private Integer pointsLeadLap;

    @Column(name = "points_fast_lap")
    private Integer pointsFastLap;

    //Maximum finishing position to get points for fast lap
    @Column(name = "max_pos_fast_lap")
    private Integer maxPosFastLap = 9999;

    //Minimum percentage of the race to be completed to award points for fast lap
    @Column(name = "pct_completed_fl")
    private Integer pctCompletedFastLap = 0;

    @Column(name = "always_assign_fl")
    private Boolean alwaysAssignFastLap = true;

    //If started from pitlane, award points for fast lap?
    @Column(name = "pitlane_start_allowed")
    private Boolean pitlaneStartAllowed = false;

    @Column(name = "race_pct_completed_total_points")
    private Integer racePctCompleted;

    @Column(name = "pct_total_points")
    private Integer pctTotalPoints;

    @Column(name="active")
    private Boolean active;

    public Boolean isActive() {
		return active;
	}

    @Transient
    public float[] disclosePoints() {
    	String[] tmp = StringUtils.remove(points, " ").split(",");
    	float[] result = new float[tmp.length];
		for(int i = 0; i < result.length; i++) {
			result[i] = Float.parseFloat(tmp[i]);
		}
		return result;
    }

    public Boolean isAlwaysAssignFastLap() {
        return alwaysAssignFastLap;
    }

	public Boolean isPitlaneStartAllowed() {
		return pitlaneStartAllowed;
	}

}
