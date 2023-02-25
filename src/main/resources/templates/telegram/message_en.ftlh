<#if rallyOrRaid = true><b>${session.shortname} - ${session.name}</b> stage</#if><#if rallyOrRaid = false><b>${session.name}</b> session</#if> belonging to <b>${session.eventEdition.longEventName}</b> will start in <#if minutesToStart = 15>15 minutes</#if><#if minutesToStart = 60>1 hour</#if><#if minutesToStart = 180>3 hours</#if><#if rallyOrRaid = false> at <b>${session.eventEdition.trackLayout.racetrack.name}</b></#if>

<#if logoUrl??><a href="${logoUrl}">&#8205;</a></#if>
