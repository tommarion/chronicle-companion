export default abstract class DateUtil {

    static formatDate(date: string, includeSeconds: boolean): string {
        let dateObj = new Date(date);
        let current = new Date();
        let dayDifference = (current.getTime() - dateObj.getTime()) / (1000 * 3600 * 24);
        let formattedDate = '';
        if (dayDifference > 7) {
            formattedDate += this.getMonthValue(dateObj.getMonth()) + " " + dateObj.getDate();
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
        } else if (dayDifference <= 2 && dayDifference > 1) {
            formattedDate += "Yesterday"
        } else if (dayDifference <= 1 && dayDifference > 0) {
            formattedDate += "Today"
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