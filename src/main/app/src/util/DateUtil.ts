export default abstract class DateUtil {

    static readonly FORMAT_DATE = (date: string, includeSeconds: boolean): string => {
        let dateObj = new Date(date);
        let current = new Date();
        let hourDifference = (current.getTime() - dateObj.getTime()) / (1000 * 3600);
        let formattedDate = '';
        if (hourDifference > 7 * 24) {
            formattedDate += this.getMonthValue(dateObj.getMonth()) + " " + dateObj.getDate();
            if (dateObj.getDate() > 10 && dateObj.getDate() < 20) {
                formattedDate += 'th'
            } else {
                switch (dateObj.getDate() % 10) {
                    case 1:
                        formattedDate += 'st';
                        break;
                    case 2:
                        formattedDate += 'nd';
                        break;
                    case 3:
                        formattedDate += 'rd';
                        break;
                    default:
                        formattedDate += 'th';
                }
            }
        } else if (hourDifference <= 48 && hourDifference > 24) {
            formattedDate += "Yesterday"
        } else if (hourDifference <= 24 && hourDifference > 12) {
            formattedDate += "Today"
        } else if (hourDifference <= 12 && hourDifference > 1) {
            let hours = Math.floor(hourDifference);
            return hours + ' hour' + (hours > 1 ? 's' : '') + ' ago';
        } else if (hourDifference <= 1 && hourDifference > 1/60) {
            let minutes = Math.floor(hourDifference * 60);
            return minutes + ' minute' + (minutes > 1 ? 's' : '') + ' ago';
        } else if (hourDifference <= 1/60 && hourDifference > 1/3600) {
            let seconds = Math.floor(hourDifference * 3600);
            return seconds + ' second' + (seconds > 1 ? 's' : '') + ' ago';
        } else if (hourDifference <= 1/3600 && hourDifference > 0) {
            return 'Just Now';
        } else {
            formattedDate += this.getDayValue(dateObj.getDay());
        }
        formattedDate += ' ';
        let hours = dateObj.getHours();
        let am = true;
        if (hours > 12) {
            am = false;
            formattedDate += (hours - 12);
        } else if (dateObj.getHours() > 0) {
            formattedDate += hours;
        } else {
            formattedDate += '12';
        }
        formattedDate += ':';
        if (dateObj.getMinutes() < 10) {
            formattedDate += '0';
        }
        formattedDate += dateObj.getMinutes();
        if (includeSeconds) {
            formattedDate += ':';
            if (dateObj.getSeconds() < 10) {
                formattedDate += '0';
            }
            formattedDate += dateObj.getSeconds();
        }
        formattedDate += am ? 'AM' : 'PM';
        return formattedDate;
    }

    static getDayValue(day: number): string {
        switch (day) {
            case 0:
                return "Sunday";
            case 1:
                return "Monday";
            case 2:
                return "Tuesday";
            case 3:
                return "Wednesday";
            case 4:
                return "Thursday";
            case 5:
                return "Friday";
            case 6:
                return "Saturday";
        }
    }

    static getMonthValue(month: number): string {
        switch (month) {
            case 0:
                return "Jan";
            case 1:
                return "Feb";
            case 2:
                return "Mar";
            case 3:
                return "Apr";
            case 4:
                return "May";
            case 5:
                return "Jun";
            case 6:
                return "Jul";
            case 7:
                return "Aug";
            case 8:
                return "Sep";
            case 9:
                return "Oct";
            case 10:
                return "Nov";
            case 11:
                return "Dec";
        }
    }
}