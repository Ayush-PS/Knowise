// LinkedCharts.js
import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import axios from 'axios';

const LinkedCharts = () => {
  const [countryData, setCountryData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [percentageData, setPercentageData] = useState([]);

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        console.log('Fetching country data...');
        // Fetch country data (top 5 countries by population) from Restcountries API
        const response = await axios.get(
          'https://restcountries.com/v2/all?fields=name,population,area'
        );

        const countries = response.data
          .filter((country) => country.population && country.area)
          .slice(0, 9)
          .map((country) => ({
            countryName: country.name,
            population: country.population,
            area: country.area,
          }));

        setCountryData(countries);
        console.log('Country data fetched:', countries);
      } catch (error) {
        console.error('Error fetching country data:', error);
      }
    };

    fetchCountryData();
  }, []);

  useEffect(() => {
    // Calculate percentage data for both charts
    const totalPopulation = countryData.reduce((sum, country) => sum + country.population, 0);
    const totalArea = countryData.reduce((sum, country) => sum + country.area, 0);

    const percentageCountries = countryData.map((country) => ({
      countryName: country.countryName,
      populationPercentage: (country.population / totalPopulation) * 100,
      areaPercentage: (country.area / totalArea) * 100,
    }));

    setPercentageData(percentageCountries);
  }, [countryData]);

  const handlePieClick = (entry) => {
    // Fetch area data upon clicking the pie chart
    setSelectedCountry(entry.countryName);
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#c71585'];

  return (
    <div>
      <ResponsiveContainer width="100%" height={700}>
        <PieChart>
          <Pie
            data={percentageData}
            dataKey="populationPercentage"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label
            onClick={(event) => handlePieClick(event)}
          >
            {percentageData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {selectedCountry && (
        <ResponsiveContainer width="50%" height={300}>
          <BarChart
            data={percentageData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="countryName" />
            <YAxis yAxisId="left" label={{ value: 'Population Percentage', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'Area Percentage', angle: 90, position: 'insideRight' }} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="populationPercentage"
              fill="#8884d8"
              name="Population Percentage"
              yAxisId="left"
            />
            <Bar
              dataKey="areaPercentage"
              fill="#82ca9d"
              name="Area Percentage"
              yAxisId="right"
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default LinkedCharts;
