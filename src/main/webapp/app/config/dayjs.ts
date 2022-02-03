import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as localizedFormat from 'dayjs/plugin/localizedFormat';
import * as duration from 'dayjs/plugin/duration';
import * as relativeTime from 'dayjs/plugin/relativeTime';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from "dayjs/plugin/utc";

// jhipster-needle-i18n-language-dayjs-imports - JHipster will import languages from dayjs here
import 'dayjs/locale/en';
import 'dayjs/locale/ca';
import 'dayjs/locale/es';

// DAYJS CONFIGURATION
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.extend(duration);
dayjs.extend(relativeTime);
