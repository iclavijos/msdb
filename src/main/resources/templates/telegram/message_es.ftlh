<#if rallyOrRaid = true>La etapa <b>${session.shortname} - ${session.name}</b></#if><#if rallyOrRaid = false>La sesión <b>${session.name}</b></#if> perteneciente a <b>${session.eventEdition.longEventName}</b> empieza en <#if minutesToStart = 15>15 minutos</#if><#if minutesToStart = 60>1 hora</#if><#if minutesToStart = 180>3 horas</#if><#if rallyOrRaid = false> en <b>${session.eventEdition.trackLayout.racetrack.name}</b></#if>

<#if logoUrl??><a href="${logoUrl}">&#8205;</a></#if>
