<#if rallyOrRaid = true>L'etapa <b>${session.shortname} - ${session.name}</b></#if><#if rallyOrRaid = false>La sessió <b>${session.name}</b></#if> que pertany a <b>${session.eventEdition.longEventName}</b> comença en <#if minutesToStart = 15>15 minuts</#if><#if minutesToStart = 60>1 hora</#if><#if minutesToStart = 180>3 hores</#if><#if rallyOrRaid = false> a <b>${session.eventEdition.trackLayout.racetrack.name}</b></#if>

<#if logoUrl??><a href="${logoUrl}">&#8205;</a></#if>
