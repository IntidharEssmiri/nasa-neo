import { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { fetchNEOData } from "../services/NEOService";
import { FaSearch } from 'react-icons/fa';

interface NEO {
  id: string;
  name: string;
  min_diameter: number;
  max_diameter: number;
  orbiting_body: string;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  close_approach_data: {
    orbiting_body: string;
  }[];
}

const NEOChart = () => {
  const [data, setData] = useState<NEO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedBody, setSelectedBody] = useState<string>("Earth");
  const [orbitingBodies, setOrbitingBodies] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    const getData = async () => {
      const neoData = await fetchNEOData();
      if (!neoData.length) {
        setError(true);
        setLoading(false);
        return;
      }

      const bodies = Array.from(new Set(
        neoData
          .map((neo: NEO) => neo.close_approach_data[0]?.orbiting_body)
          .filter((body: string) => body)
      )) as string[];

      setOrbitingBodies(bodies);

      const transformedData = neoData.map((neo: NEO) => ({
        id: neo.id,
        name: neo.name,
        min_diameter: neo.estimated_diameter.kilometers.estimated_diameter_min,
        max_diameter: neo.estimated_diameter.kilometers.estimated_diameter_max,
        orbiting_body: neo.close_approach_data[0]?.orbiting_body,
      }));

      const filteredData = transformedData.filter((neo: NEO) => neo.orbiting_body === selectedBody);
      filteredData.sort((a: NEO, b: NEO) => (b.min_diameter + b.max_diameter) / 2 - (a.min_diameter + a.max_diameter) / 2);

      setData(filteredData.slice(0, 10));
      setLoading(false);
    };

    getData();
  }, [selectedBody]);

  const handleSearchFocus = () => {
    setIsDropdownOpen(true);  
  };
  
  const filteredBodies = searchTerm === "" 
  ? orbitingBodies   
  : orbitingBodies.filter((body) =>
      body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBodySelection = (body: string) => {
    setSelectedBody(body);
    setIsDropdownOpen(false);
    setSearchTerm(body);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsDropdownOpen(true);
  };

  if (loading) return <p className="text-center text-xl">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error fetching data</p>;

  const options = {
    chart: {
      type: 'bar'
    },
    title: {
      text: null  // Pas de titre ici
    },
    xAxis: {
      categories: data.map(neo => neo.name),
      title: {
        text: null
      },
      gridLineWidth: 1,
      lineWidth: 0
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Diameter (km)',
        align: 'high'
      },
      labels: {
        overflow: 'justify'
      },
      gridLineWidth: 0
    },
    tooltip: {
      shared: true,
      valueSuffix: ' km'
    },
    plotOptions: {
      bar: {
        borderRadius: '50%',
        dataLabels: {
          enabled: true
        },
        groupPadding: 0.1
      }
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'top',
      x: -40,
      y: 80,
      floating: true,
      borderWidth: 1,
      backgroundColor: Highcharts.defaultOptions.legend ? Highcharts.defaultOptions.legend.backgroundColor : '#FFFFFF',
      shadow: true
    },
    credits: {
      enabled: false
    },
    series: [
      {
        name: 'Min Diameter',
        data: data.map(neo => neo.min_diameter),
        color: '#4285F4'
      },
      {
        name: 'Max Diameter',
        data: data.map(neo => neo.max_diameter),
        color: '#EA4335'
      }
    ]
  };

  return (
    <div>
      <h2 className="text-center text-2xl font-bold mb-4">Near-Earth Objects (NEO) Diameters</h2>
      <div className="container">

        <div className="search-card">
          <div className="search-title">
            <span>Orbiting Body: <span className="selected-body">{selectedBody}</span></span>
          </div>
          <div className="search-input-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus} 
              placeholder="Type to search..."
              className="search-input"
            />
          </div>
          {isDropdownOpen && filteredBodies.length > 0 && (
            <div className="dropdown-list">
              {filteredBodies.map((body) => (
                <div
                  key={body}
                  className="dropdown-item"
                  onClick={() => handleBodySelection(body)}
                >
                  {body}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ width: '100%', height: '400px' }}>
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
          />
        </div>
      </div>
    </div>
  );
};

export default NEOChart;
