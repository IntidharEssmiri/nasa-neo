import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
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

      <ResponsiveContainer width="100%" height={400}>
        <BarChart layout="vertical" data={data}>
          <XAxis type="number" label={{ value: "Diameter (km)", position: "insideBottom", offset: -5 }} />
          <YAxis type="category" dataKey="name" width={150} label={{ value: "NEO Name", angle: -90, position: "insideLeft", offset: 1 }} tick={{ fontSize: 14 }} />
          <Tooltip />
          <Legend verticalAlign="top" align="center" />
          <Bar dataKey="min_diameter" fill="#4285F4" name="Min Estimated Diameter (km)" />
          <Bar dataKey="max_diameter" fill="#EA4335" name="Max Estimated Diameter (km)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
    </div>
  );
};

export default NEOChart;