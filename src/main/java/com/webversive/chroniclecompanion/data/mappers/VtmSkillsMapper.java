package com.webversive.chroniclecompanion.data.mappers;

import com.webversive.chroniclecompanion.data.app.character.VtmSkills;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class VtmSkillsMapper implements RowMapper<VtmSkills> {

    @Override
    public VtmSkills mapRow(ResultSet resultSet, int rowNum) throws SQLException {
        return VtmSkills.builder()
                .academics(resultSet.getInt("academics"))
                .academicsSpecialty(resultSet.getString("academics_specialty"))
                .animalKen(resultSet.getInt("animal_ken"))
                .animalKenSpecialty(resultSet.getString("animal_ken_specialty"))
                .athletics(resultSet.getInt("athletics"))
                .athleticsSpecialty(resultSet.getString("athletics_specialty"))
                .awareness(resultSet.getInt("awareness"))
                .awarenessSpecialty(resultSet.getString("awareness_specialty"))
                .brawl(resultSet.getInt("brawl"))
                .brawlSpecialty(resultSet.getString("brawl_specialty"))
                .craft(resultSet.getInt("craft"))
                .craftSpecialty(resultSet.getString("craft_specialty"))
                .drive(resultSet.getInt("drive"))
                .driveSpecialty(resultSet.getString("drive_specialty"))
                .etiquette(resultSet.getInt("etiquette"))
                .etiquetteSpecialty(resultSet.getString("etiquette_specialty"))
                .finance(resultSet.getInt("finance"))
                .financeSpecialty(resultSet.getString("finance_specialty"))
                .firearms(resultSet.getInt("firearms"))
                .firearmsSpecialty(resultSet.getString("firearms_specialty"))
                .insight(resultSet.getInt("insight"))
                .insightSpecialty(resultSet.getString("insight_specialty"))
                .intimidation(resultSet.getInt("intimidation"))
                .intimidationSpecialty(resultSet.getString("intimidation_specialty"))
                .investigation(resultSet.getInt("investigation"))
                .investigationSpecialty(resultSet.getString("investigation_specialty"))
                .larceny(resultSet.getInt("larceny"))
                .larcenySpecialty(resultSet.getString("larceny_specialty"))
                .leadership(resultSet.getInt("leadership"))
                .leadershipSpecialty(resultSet.getString("leadership_specialty"))
                .melee(resultSet.getInt("melee"))
                .meleeSpecialty(resultSet.getString("melee_specialty"))
                .occult(resultSet.getInt("occult"))
                .occultSpecialty(resultSet.getString("occult_specialty"))
                .performance(resultSet.getInt("performance"))
                .performanceSpecialty(resultSet.getString("performance_specialty"))
                .persuasion(resultSet.getInt("persuasion"))
                .persuasionSpecialty(resultSet.getString("persuasion_specialty"))
                .politics(resultSet.getInt("politics"))
                .politicsSpecialty(resultSet.getString("politics_specialty"))
                .science(resultSet.getInt("science"))
                .scienceSpecialty(resultSet.getString("science_specialty"))
                .stealth(resultSet.getInt("stealth"))
                .stealthSpecialty(resultSet.getString("stealth_specialty"))
                .streetwise(resultSet.getInt("streetwise"))
                .streetwiseSpecialty(resultSet.getString("streetwise_specialty"))
                .subterfuge(resultSet.getInt("subterfuge"))
                .subterfugeSpecialty(resultSet.getString("subterfuge_specialty"))
                .survival(resultSet.getInt("survival"))
                .survivalSpecialty(resultSet.getString("survival_specialty"))
                .technology(resultSet.getInt("technology"))
                .technologySpecialty(resultSet.getString("technology_specialty"))
                .build();
    }
}
