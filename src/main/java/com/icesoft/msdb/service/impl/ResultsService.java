package com.icesoft.msdb.service.impl;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.icesoft.msdb.domain.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.icesoft.msdb.domain.enums.DurationType;
import com.icesoft.msdb.domain.enums.ResultType;
import com.icesoft.msdb.repository.DriverEventPointsRepository;
import com.icesoft.msdb.repository.EventEntryRepository;
import com.icesoft.msdb.repository.EventEntryResultRepository;
import com.icesoft.msdb.repository.EventSessionRepository;
import com.icesoft.msdb.repository.ManufacturerEventPointsRepository;
import com.icesoft.msdb.repository.SeriesEditionRepository;
import com.icesoft.msdb.repository.TeamEventPointsRepository;
import com.icesoft.msdb.repository.impl.JDBCRepositoryImpl;
import com.icesoft.msdb.service.dto.ParticipantPointsDTO;
import com.icesoft.msdb.service.dto.ManufacturerPointsDTO;

@Service
@Transactional(readOnly = true)
public class ResultsService {
	private final Logger log = LoggerFactory.getLogger(ResultsService.class);

	@Autowired private EventSessionRepository sessionRepo;
	@Autowired private EventEntryResultRepository resultsRepo;
	@Autowired private EventEntryRepository eventEntryRepository;
	@Autowired private SeriesEditionRepository seriesEdRepository;
	@Autowired private DriverEventPointsRepository driverPointsRepo;
	@Autowired private TeamEventPointsRepository teamPointsRepo;
	@Autowired private ManufacturerEventPointsRepository manufacturerPointsRepo;
	@Autowired private JDBCRepositoryImpl viewsRepo;

	@Autowired private CacheHandler cacheHandler;

	@Transactional(readOnly = false)
	public void processSessionResults(Long sessionId) {
		EventSession session = sessionRepo.findById(sessionId).get();

		for(PointsSystemSession pss: session.getPointsSystemsSession()) {
			List<DriverEventPoints> drivers = new ArrayList<>();
			Map<Long, TeamEventPoints> teams = new HashMap<>();
			Map<String, ManufacturerEventPoints> manufacturers = new HashMap<>();

			PointsSystem ps = pss.getPointsSystem();
			float[] points = Optional.ofNullable(ps).map(p -> p.disclosePoints()).get();
			float pointsPct = 1f;

			driverPointsRepo.deleteSessionPoints(sessionId, pss.getSeriesEdition().getId());
			teamPointsRepo.deleteSessionPoints(sessionId, pss.getSeriesEdition().getId());
			manufacturerPointsRepo.deleteSessionPoints(sessionId, pss.getSeriesEdition().getId());

			List<EventEntryResult> results = resultsRepo.findBySessionIdOrderByFinalPositionAsc(session.getId());
			if (results.isEmpty()) {
			    return;
            }
			if (ps.getRacePctCompleted() > 0) {
				EventEntryResult result = results.get(0);
				if (session.isRace() && session.getDurationType().equals(DurationType.LAPS.getValue())) {
					Float completionPct = ((float)result.getLapsCompleted().intValue() / (float)session.getDuration().intValue()) * 100;
					if (completionPct.intValue() < ps.getRacePctCompleted()) {
						pointsPct = ps.getPctTotalPoints() / 100f;
					}
				}
			}
			if (!pss.getSeriesEdition().getStandingsPerCategory()) {
                calculatePoints(pss, ps, pss.getSeriesEdition().getAllowedCategories().get(0), results, session, points, pointsPct, drivers, teams, manufacturers);
            } else {
                for(Category category: pss.getEventSession().getEventEdition().getAllowedCategories()) {
                    List<EventEntryResult> resultsCat = results.stream().filter(r -> r.getEntry().getCategory().equals(category)).collect(Collectors.toList());
                    calculatePoints(pss, ps, category, resultsCat, session, points, pointsPct, drivers, teams, manufacturers);
                }
            }

			log.debug("Persisting points...");
			drivers.stream().forEach(entry -> driverPointsRepo.save(entry));
			teams.entrySet().stream().forEach(entry -> teamPointsRepo.save(entry.getValue()));
			manufacturers.entrySet().stream().forEach(entry -> manufacturerPointsRepo.save(entry.getValue()));
			cacheHandler.resetDriversStandingsCache(pss.getSeriesEdition().getId());
		}

		log.info("Processed result for {}-{}.", session.getEventEdition().getLongEventName(), session.getName());
	}

	private void calculatePoints(PointsSystemSession pss, PointsSystem ps, Category category, List<EventEntryResult> results,
                                 EventSession session, float[] points, float pointsPct, List<DriverEventPoints> drivers,
                                 Map<Long, TeamEventPoints> teams, Map<String, ManufacturerEventPoints> manufacturers) {

	    for(int i = 0; i < results.size(); i++) {
            EventEntryResult result = results.get(i);
            Boolean sharedDrive = result.getSharedWith() != null;

            float calculatedPoints = 0f;
            if (points != null) {
                if (result.getFinalPosition() < 800 && (i+1) <= points.length) {
                    calculatedPoints = (float)points[i] * pss.getPsMultiplier();
                    if (sharedDrive) {
                        calculatedPoints = calculatedPoints / 2;
                    }
                    calculatedPoints = calculatedPoints * pointsPct;
                }

                for(DriverEntry d : result.getEntry().getDrivers()) {
                    log.debug(result.getFinalPosition() + "-" + d.getDriver().getFullName() + ": " +
                        (points.length > (i+1) ? points[i] : 0));

                    DriverEventPoints dep = new DriverEventPoints(d.getDriver(), session, pss.getSeriesEdition(), session.getName());
                    dep.setCategory(category);
                    if (result.getFinalPosition() < 800 && points.length > i && (i < points.length)) {
                        dep.addPoints(calculatedPoints);
                        log.debug(String.format("Driver %s: %s(x%s) points for position %s",
                            d.getDriver().getFullName(), (float)points[i], pss.getPsMultiplier(), i+1));
                    } else {
                        dep.addPoints(0f);
                    }
                    drivers.add(dep);

                    if (result.getStartingPosition() != null &&  result.getStartingPosition() == 1) {
                        if (ps.getPointsPole() != 0) {
                            dep = new DriverEventPoints(d.getDriver(), session, pss.getSeriesEdition(), "motorsportsDatabaseApp.pointsSystem.pointsPole");
                            dep.setCategory(category);
                            dep.addPoints(ps.getPointsPole().floatValue());
                            log.debug(String.format("Driver %s: %s points for pole", d.getDriver().getFullName(), ps.getPointsPole()));
                            drivers.add(dep);
                        }
                    }
                }
                if (sharedDrive) {
                    for(DriverEntry d: result.getSharedWith().getDrivers()) {
                        DriverEventPoints dep = new DriverEventPoints(d.getDriver(), session, pss.getSeriesEdition(), session.getName());
                        dep.setCategory(category);
                        dep.addPoints(calculatedPoints);
                        drivers.add(dep);
                    }
                }

            }
        }

        if (ps != null) {
            log.debug("Race points calculated... proceeding with extra points");
            if (ps.getPointsFastLap() != 0) {
                List<EventEntryResult> fastestLapOrder = results.parallelStream()
                    .filter(r -> r.getBestLapTime() != null)
                    .sorted(Comparator.comparing(EventEntryResult::getBestLapTime))
                    .collect(Collectors.toList());

                if (fastestLapOrder.isEmpty()) {
                    log.warn("No fastest lap recorded... skipping");
                } else {
                    Stream<EventEntryResult> filtered = fastestLapOrder.parallelStream();
                    if (!ps.isPitlaneStartAllowed()) {
                        filtered = filtered.filter(eer -> !eer.isPitlaneStart());
                    }
                    if (ps.getPctCompletedFastLap() != 0) {
                        //We assume that duration will always be laps if minimum percentage completion needs to be applied
                        filtered = filtered
                            .filter(eer -> (eer.getLapsCompleted().floatValue() / eer.getSession().getDuration().floatValue()) * 100f >= ps.getPctCompletedFastLap());
                    }

                    Optional<EventEntryResult> optFastestLap = filtered.findFirst();
                    if (ps.isAlwaysAssignFastLap()) {
                        optFastestLap = filtered.filter(r -> r.getFinalPosition() <= ps.getMaxPosFastLap()).findFirst();
                    } else {
                        if (optFastestLap.isPresent()) {
                            if (optFastestLap.get().getFinalPosition() > ps.getMaxPosFastLap()) {
                                optFastestLap = Optional.empty();
                                log.warn("Driver with fastest lap does not match criteria to be awarded points");
                            }
                        }
                    }

                    if (optFastestLap.isPresent()) {
                        for (DriverEntry d : optFastestLap.get().getEntry().getDrivers()) {
                            DriverEventPoints dep = new DriverEventPoints(d.getDriver(), session, pss.getSeriesEdition(), "motorsportsDatabaseApp.pointsSystem.pointsFastLap");
                            dep.setCategory(category);
                            dep.addPoints(ps.getPointsFastLap().floatValue());
                            log.debug(String.format("Driver %s: %s points for fastest lap", d.getDriver().getFullName(), ps.getPointsFastLap()));
                            drivers.add(dep);
                        }
                    } else {
                        log.warn("No recorded fast lap complied with all the requirements");
                    }
                }
            }
            if (ps.getPointsLeadLap() != 0 || ps.getPointsMostLeadLaps() != 0) {

                Comparator<EventEntryResult> c = (r1, r2) -> {
                    if (r1.getLapsLed().equals(r2.getLapsLed())) {
                        return r1.getFinalPosition().compareTo(r2.getFinalPosition());
                    } else {
                        return r1.getLapsLed().compareTo(r2.getLapsLed()) * -1;
                    }
                };
                List<EventEntryResult> ledLaps = results.parallelStream()
                    .filter(r -> r.getLapsLed() > 0)
                    .sorted(c)
                    .collect(Collectors.toList());

                int maxLedLaps = 0;
                for(EventEntryResult r : ledLaps) {
                    boolean addPointsMostLeadLaps = false;
                    if (r.getLapsLed() > maxLedLaps && maxLedLaps == 0) { //|| r.getLapsLed() == maxLedLaps) {
                        maxLedLaps = r.getLapsLed();
                        addPointsMostLeadLaps = true;
                    }
                    for(DriverEntry d : r.getEntry().getDrivers()) {
                        DriverEventPoints dep = new DriverEventPoints(d.getDriver(), session, pss.getSeriesEdition(), "motorsportsDatabaseApp.pointsSystem.pointsLeadLap");
                        if (category != null) {
                            dep.setCategory(category);
                        }
                        dep.addPoints(ps.getPointsLeadLap().floatValue());
                        log.debug(String.format("Driver %s: %s points for leading %s laps", d.getDriver().getFullName(), ps.getPointsLeadLap(), r.getLapsLed()));
                        drivers.add(dep);
                        if (addPointsMostLeadLaps) {
                            dep = new DriverEventPoints(d.getDriver(), session, pss.getSeriesEdition(), "motorsportsDatabaseApp.pointsSystem.pointsMostLeadLaps");
                            if (category != null) {
                                dep.setCategory(category);
                            }
                            dep.addPoints(ps.getPointsMostLeadLaps().floatValue());
                            log.debug(String.format("Driver %s: %s points for most led laps", d.getDriver().getFullName(), ps.getPointsMostLeadLaps()));
                            drivers.add(dep);
                        }
                    }
                }
            }
        }

        //Points for each driver calculated. Proceeding with teams and manufacturers
        if (pss.getSeriesEdition().getTeamsStandings()) {
            List<EventEditionEntry> entries = eventEntryRepository.findEventEditionEntries(session.getEventEdition().getId());
            for(EventEditionEntry entry: entries) {
                Driver driver = entry.getDrivers().stream().findFirst().get().getDriver(); //We will only deal with the first one so multidriver entries are handled just once
                if (entry.getTeam() != null) {
                    double dPoints = drivers.stream().filter(dp -> dp.getDriver().getId().equals(driver.getId())).mapToDouble(dp -> dp.getPoints()).sum();
                    TeamEventPoints tep = teams.get(entry.getTeam().getId());
                    if (tep == null) {
                        tep = new TeamEventPoints();
                        tep.setSession(session);
                        tep.setSeriesEdition(pss.getSeriesEdition());
                        tep.setTeam(entry.getTeam());
                        if (category != null) {
                            tep.setCategory(category);
                        }
                    }
                    tep.addPoints((float)dPoints);
                    teams.put(entry.getTeam().getId(), tep);
                }
            }
        }

        if (pss.getSeriesEdition().getManufacturersStandings()) {
            List<EventEditionEntry> entries = eventEntryRepository.findEventEditionEntries(session.getEventEdition().getId());
            for(EventEditionEntry entry: entries) {
                String manufacturer = entry.getManufacturer();
                if (!manufacturers.containsKey(manufacturer)) {
                    double mPoints = results.parallelStream()
                        .filter(r -> r.getEntry().getManufacturer().equals(manufacturer)).limit(2)
                        .mapToDouble(r -> drivers.stream().filter(
                            dp -> dp.getDriver().getId().equals(r.getEntry().getDrivers().stream().findFirst().get().getId())).mapToDouble(dp -> dp.getPoints()).sum())
                        .sum();


                    if (mPoints > 0) {
                        ManufacturerEventPoints mep = manufacturers.get(entry.getChassis().getManufacturer());
                        if (mep == null) {
                            mep = new ManufacturerEventPoints();
                            mep.setSession(session);
                            mep.setSeriesEdition(pss.getSeriesEdition());
                            mep.setManufacturer(manufacturer);
                            if (category != null) {
                                mep.setCategory(category);
                            }
                        }
                        mep.addPoints((float)mPoints);
                        manufacturers.put(manufacturer, mep);
                    }
                }
            }
        }
    }

	public List<ParticipantPointsDTO> getDriversStandings(Long seriesId) {
		List<ParticipantPointsDTO> standings = viewsRepo.getDriversStandings(seriesId);
		Map<Long, List<Object[]>> positions = viewsRepo.getDriversResultsInSeries(seriesId);

		Comparator<ParticipantPointsDTO> c = (o1, o2) -> {
			if (o1.getPoints().floatValue() != o2.getPoints().floatValue()) {
				return o1.getPoints().compareTo(o2.getPoints());
			} else {
				List<Object[]> positionsD1 = positions.get(o1.getParticipantId());
				List<Object[]> positionsD2 = positions.get(o2.getParticipantId());

				return sortPositions(positionsD1, positionsD2);
			}
		};

		standings.sort(c.reversed());
		return standings;
	}

	public List<ParticipantPointsDTO> getDriversPointsEvent(Long eventId) {
		return getDriversPointsEvent(null, eventId);
	}

	public List<ParticipantPointsDTO> getDriversPointsEvent(Long seriesId, Long eventId) {
		List<Object[]> pointsEvent;
		if (seriesId == null) {
			pointsEvent = driverPointsRepo.getDriversPointsInEvent(eventId);
		} else {
			pointsEvent = driverPointsRepo.getDriversPointsInEvent(seriesId, eventId);
		}

		return pointsEvent.parallelStream().map(dep -> new ParticipantPointsDTO(
				null,
				(Long)dep[0],
				(String)dep[1] + " " + (String)dep[2],
				((Double)dep[3]).floatValue(),
				((Long)dep[4]).intValue(), null, "")).collect(Collectors.toList());
	}

	public List<ParticipantPointsDTO> getDriverPointsEvent(Long eventId, Long driverId) {
		List<Object[]> pointsEvent = driverPointsRepo.getDriverPointsInEvent(eventId, driverId);

		return pointsEvent.parallelStream().map(dep -> new ParticipantPointsDTO(
				(Long)dep[0], (String)dep[1] + " " + (String)dep[2],
				(Float)dep[3], (String)dep[4], null)).collect(Collectors.toList());
	}

    public List<ParticipantPointsDTO> getTeamsPointsEvent(Long eventId) {
        return getTeamsPointsEvent(null, eventId);
    }

    public List<ParticipantPointsDTO> getTeamsPointsEvent(Long seriesId, Long eventId) {
        List<Object[]> pointsEvent = Optional.ofNullable(seriesId)
            .map(id -> teamPointsRepo.getTeamsPointsInEvent(seriesId, eventId))
            .orElseGet(() -> teamPointsRepo.getTeamsPointsInEvent(eventId));

        return pointsEvent.parallelStream().map(tep -> new ParticipantPointsDTO(
            null,
            (Long)tep[0],
            (String)tep[1],
            ((Double)tep[2]).floatValue(),
            ((Long)tep[3]).intValue(), null, "")).collect(Collectors.toList());
    }

    public List<ParticipantPointsDTO> getTeamPointsEvent(Long eventId, Long teamId) {
        List<Object[]> pointsEvent = teamPointsRepo.getTeamPointsInEvent(eventId, teamId);

        return pointsEvent.parallelStream().map(tep -> new ParticipantPointsDTO(
            (Long)tep[0], (String)tep[1],
            (Float)tep[2], (String)tep[3], null)).collect(Collectors.toList());
    }

	public PointsRaceByRace getPointsRaceByRace(Long seriesEditionId) {
		List<Object[]> pointsSeries = driverPointsRepo.getDriversPointsInSeries(seriesEditionId);
		PointsRaceByRace result = new PointsRaceByRace();
		pointsSeries.stream().forEach(ps -> {
            result.addDriverPoints(
                (String) ps[0], (String) ps[1], (String) ps[5], (String) ps[2] + " " + (String) ps[3], ((Double) ps[4]).floatValue());
        });

		return result;
	}

	public String[][] getResultsRaceByRace(Long seriesEditionId, String category) {
		SeriesEdition seriesEdition = seriesEdRepository.findById(seriesEditionId).get();
		List<EventSession> races = sessionRepo.findRacesInSeries(seriesEdition);
		List<ParticipantPointsDTO> dpd = getDriversStandings(seriesEditionId); //We use this as returned data is ordered by scored points
        dpd = dpd.stream().filter(d -> d.getCategory() == null ? true : d.getCategory().equals(category)).collect(Collectors.toList());
		List<String> driverNames = dpd.stream().map(driver -> driver.getParticipantName()).collect(Collectors.toList());

		String[][] data = new String[driverNames.size() + 1][races.size() + 1];
		for(int i = 1; i <= driverNames.size(); i++) {
			data[i][0] = driverNames.get(i - 1);
			for(int j = 1; j <= races.size(); j++) {
				data[i][j] = "-";
			}
		}
		for(int i = 1; i <= races.size(); i++) {
			EventSession session = races.get(i - 1);
			data[0][i] = session.getShortname().equalsIgnoreCase("R") || session.getShortname().equalsIgnoreCase("Race") ?
					session.getEventEdition().getEvent().getName() :
					session.getEventEdition().getEvent().getName() + "-" + session.getName();

			List<EventEntryResult> results = resultsRepo.findBySessionIdOrderByFinalPositionAsc(session.getId());
			int posInCategory = 1;
			for(EventEntryResult result: results) {
			    if (result.getEntry().getCategory().getShortname().equals(category)) {
                    String res;
                    if (result.getFinalPosition() >= 800) {
                        res = ResultType.valueOf(result.getFinalPosition()).getStringValue();
                    } else {
                        if (!seriesEdition.getStandingsPerCategory()) {
                            res = Integer.toString(result.getFinalPosition());
                        } else {
                            res = Integer.toString(posInCategory++);
                        }
                    }

                    for (DriverEntry driver : result.getEntry().getDrivers()) {
                        int pos = driverNames.indexOf(driver.getDriver().getFullName());
                        if (pos == -1) {
                            log.warn("Driver not found: " + driver.getDriver().getFullName());
                        }
                        data[pos + 1][i] = res;
                    }
                }
			}
		}

		return data;
	}

	public String[][] getDriverEventBestTimes(Long eventEditionId) {
		List<EventEditionEntry> entries = eventEntryRepository.findEventEditionEntries(eventEditionId);
		List<EventSession> sessions = sessionRepo.findByEventEditionIdOrderBySessionStartTimeAsc(eventEditionId);
		String[][] data = new String[entries.size() + 1][sessions.size() + 1];
		data[0][0] = "-";

		for(int i = 1; i <= sessions.size(); i++) {
			data[0][i] = sessions.get(i - 1).getName();
		}

		for(int i = 1; i <= entries.size(); i++) {
			EventEditionEntry entry = entries.get(i - 1);
			data[i][0] = "#" + entry.getRaceNumber() + " " + entry.getDriversName();
			List<EventEntryResult> results = resultsRepo.findByEntryId(entry.getId());
			for(int j = 1; j <= sessions.size(); j++) {
			    EventEntryResult result = null;
			    for(EventEntryResult tmp : results) {
			        if (tmp.getSession().equals(sessions.get(j - 1))) {
			            result = tmp;
                    }
                }
				if (result != null) {
					data[i][j] = Optional.ofNullable(result.getBestLapTime()).map(laptime -> laptime.toString()).orElse("-");
				} else {
					data[i][j] = "-";
				}
			}
		}

		return data;
	}

	public List<ParticipantPointsDTO> getTeamsStandings(Long seriesId) {
		List<ParticipantPointsDTO> standings = viewsRepo.getTeamsStandings(seriesId);
		Map<Long, List<Object[]>> positions = viewsRepo.getTeamsResultsInSeries(seriesId);

		Comparator<ParticipantPointsDTO> c = (o1, o2) -> {
			if (o1.getPoints().floatValue() != o2.getPoints().floatValue()) {
				return o1.getPoints().compareTo(o2.getPoints());
			} else {
				List<Object[]> positionsT1 = positions.get(o1.getParticipantId());
				List<Object[]> positionsT2 = positions.get(o2.getParticipantId());

				return sortPositions(positionsT1, positionsT2);
			}
		};

		standings.sort(c.reversed());
		return standings;
	}

	public List<ManufacturerPointsDTO> getManufacturersStandings(Long seriesId) {
		return viewsRepo.getManufacturersStandings(seriesId);
	}

	private int sortPositions(List<Object[]> positionsD1, List<Object[]> positionsD2) {
		Comparator<Object[]> pc = (pc1, pc2) -> ((Integer)pc1[0]).compareTo((Integer)pc2[0]);
		if (positionsD1 != null) positionsD1.sort(pc);
		if (positionsD2 != null) positionsD2.sort(pc);

		if (positionsD1 == null || positionsD1.isEmpty()) {
			if (positionsD2 == null || positionsD2.isEmpty()) {
				return 0;
			} else {
				return -1;
			}
		} else {
			if (positionsD2 == null || positionsD2.isEmpty()) {
				return 1;
			} else {
				for(int i = 0; i < positionsD1.size(); i++) {
					if (i + 1 > positionsD2.size()) {
						return 1;
					}
					Integer pD1, tD1, pD2, tD2;
					pD1 = (Integer)positionsD1.get(i)[0];
					tD1 = (Integer)positionsD1.get(i)[1];
					pD2 = (Integer)positionsD2.get(i)[0];
					tD2 = (Integer)positionsD2.get(i)[1];
					if (pD1.intValue() > pD2.intValue()) {
						return -1;
					} else if (pD1.intValue() < pD2.intValue()) {
						return 1;
					} else {
						if (tD1.intValue() > tD2.intValue()) {
							return 1;
						} else if (tD1.intValue() < tD2.intValue()) {
							return -1;
						}
					}
				}
				if (positionsD2.size() > positionsD1.size()) {
					return -1;
				}
				return 0;
			}
		}
	}
}
