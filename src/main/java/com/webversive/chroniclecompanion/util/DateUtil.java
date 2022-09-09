package com.webversive.chroniclecompanion.util;

import lombok.extern.slf4j.Slf4j;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

@Slf4j
public class DateUtil {

    private static final SimpleDateFormat FORMAT = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss");

    public static Date getDateFromSQLString(String dateString) {
        Date date = new Date();
        try {
            date = FORMAT.parse(dateString);
        } catch (ParseException pex) {
            log.error(pex.getMessage(), pex);
        }
        return date;
    }

    public static String getCurrentDate() {
        return FORMAT.format(new Date());
    }
}
