// LinkedCharts.js
import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import axios from "axios";
import classes from "./Charts.module.css";
import { random } from "lodash";
const LinkedCharts = () => {
  const [countryData, setCountryData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [percentageData, setPercentageData] = useState([]);
  const [areaPopulationData, setAreaPopulationData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        console.log("Fetching country data...");
        const response = await axios.get(
          "https://restcountries.com/v2/all?fields=name,population,area"
        );

        const countries = response.data
          .filter((country) => country.population && country.area)
          .slice(9, 18)
          .map((country) => ({
            countryName: country.name,
            population: country.population,
            area: country.area,
          }));

        setCountryData(countries);
        console.log("Country data fetched:", countries);
      } catch (error) {
        console.error("Error fetching country data:", error);
      }
    };

    fetchCountryData();
  }, []);

  useEffect(() => {
    const totalPopulation = countryData.reduce(
      (sum, country) => sum + country.population,
      0
    );
    const totalArea = countryData.reduce(
      (sum, country) => sum + country.area,
      0
    );

    const percentageCountries = countryData.map((country) => ({
      countryName: country.countryName,
      populationPercentage: (country.population / totalPopulation) * 100,
      areaPercentage: (country.area / totalArea) * 100,
    }));

    setPercentageData(percentageCountries);
  }, [countryData]);

  const handleMainPieClick = (event) => {
    setSelectedCountry(event.countryName);
    setActiveIndex(event.activeIndex);

    const selectedCountryData = countryData.find(
      (country) => country.countryName === event.countryName
    );

    if (selectedCountryData) {
      setAreaPopulationData([
        { name: "Population", value: selectedCountryData.population },
        { name: "Area", value: selectedCountryData.area },
      ]);
    }
  };

  const COLORS = [
    "#e64cc2",
    "#4c94e6",
    "#ffc658",
    "#ff7850",
    "#c71585",
    "#1abc9c",
    "#3498db",
    "#f39c12",
    "#2ecc71",
    "#e74c3c",
    "#9b59b6",
    "#34495e",
    "#d35400",
    "#27ae60",
    "#2980b9",
    "#8e44ad",
    "#c0392b",
    "#7f8c8d",
    "#e67e22",
  ];
  
  const renderTooltipContent = (props) => {
    const { payload } = props;

    if (!payload || payload.length === 0) {
      return null;
    }

    const data = payload[0].payload;
    return (
      <div className="tooltip" style={{ borderRadius: "10%", backgroundColor: "rgb(230,230,230,0.7)", padding: "0.7rem" }}>
        <p>{`Country: ${data.countryName}`}</p>
        <p>{`Population: ${data.populationPercentage.toFixed(2)}%`}</p>
        <p>{`Area: ${data.areaPercentage.toFixed(2)}%`}</p>
      </div>
    );
  };

  return (
    <div className={classes.charts}>
      <ResponsiveContainer width="100%" height={400}>
        <h5> Populatation percentages </h5>
        <PieChart>
          <Pie
            data={percentageData}
            dataKey="populationPercentage"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            onClick={(event) => handleMainPieClick(event)}
            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
              const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
              const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
              const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
              return (
                <text
                  x={x}
                  y={y}
                  fill={COLORS[index % COLORS.length]}
                  textAnchor={x > cx ? "start" : "end"}
                  dominantBaseline="central"
                  fontSize={12}
                  fontWeight="bold"
                >
                  {`${percentageData[index].countryName} ${(
                    percent * 100
                  ).toFixed(2)}%`}
                </text>
              );
            }}
            activeIndex={activeIndex}
          >
            {percentageData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                className="custom-cell"
              />
            ))}
          </Pie>
          <Tooltip content={renderTooltipContent} />
        </PieChart>
      </ResponsiveContainer>

      {selectedCountry && (
        <ResponsiveContainer width="100%" height={400}>
      <h5> {selectedCountry} Population vs Area </h5>
          <PieChart>
            <Pie
              data={areaPopulationData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                return (
                  <text
                    x={x}
                    y={y}
                    fill={COLORS[index % COLORS.length]}
                    textAnchor={x > cx ? "start" : "end"}
                    dominantBaseline="central"
                    fontSize={12}
                    fontWeight="bold"
                  >
                    {`${areaPopulationData[index].name}`}
                  </text>
                );
              }}
            >
              {areaPopulationData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index+2 % COLORS.length]}
                  className="custom-cell"
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default LinkedCharts;
