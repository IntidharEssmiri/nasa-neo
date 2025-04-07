import React, { useEffect, useState } from "react";
import { fetchNEOData } from "../services/NEOService";
import { FaSearch } from "react-icons/fa";

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

const NEOTable: React.FC = () => {
  const [data, setData] = useState<NEO[]>([]);
  const [filteredData, setFilteredData] = useState<NEO[]>([]);
  const [selectedBody, setSelectedBody] = useState<string>("Earth");
  const [orbitingBodies, setOrbitingBodies] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // Fetching NEO data and setting orbiting bodies and filtered data
  useEffect(() => {
    const getData = async () => {
      const neoData = await fetchNEOData();
      const transformed = neoData.map((neo: NEO) => ({
        id: neo.id,
        name: neo.name,
        min_diameter: neo.estimated_diameter.kilometers.estimated_diameter_min,
        max_diameter: neo.estimated_diameter.kilometers.estimated_diameter_max,
        orbiting_body: neo.close_approach_data[0]?.orbiting_body,
      }));
      const bodies = Array.from(
        new Set<string>(transformed.map((neo: NEO) => neo.orbiting_body).filter(Boolean) as string[])
      );
      setOrbitingBodies(bodies);
      setData(transformed);
      setFilteredData(
        transformed.filter((neo: NEO) => neo.orbiting_body === selectedBody)
      );
    };

    getData();
  }, []); 

  // Updating filtered data whenever selectedBody or data changes
  useEffect(() => {
    const newFiltered = data.filter((neo) => neo.orbiting_body === selectedBody);
    setFilteredData(newFiltered);
  }, [selectedBody, data]); 

  // Handle selection of orbiting body
  const handleBodySelection = (body: string) => {
    setSelectedBody(body);
    setSearchTerm(body);
    setIsDropdownOpen(false);
  };

  // Filter the orbiting bodies based on the search term
  const filteredBodies =
    searchTerm === ""
      ? orbitingBodies
      : orbitingBodies.filter((body) =>
          body.toLowerCase().includes(searchTerm.toLowerCase())
        );

  return (
    <div>
      <h2 className="text-center text-2xl font-bold mb-4">NASA’s data</h2>

      <div className="container">
        <div className="search-card">
          <div className="search-title">
            <span>
              Orbiting Body:{" "}
              <span className="selected-body">{selectedBody}</span>
            </span>
          </div>
          <div className="search-input-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Type to search..."
              className="search-input"
            />
          </div>
          {isDropdownOpen && filteredBodies.length > 0 && (
            <div className="dropdown-list">
              {filteredBodies.map((body: string) => (
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
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="w-full max-w-screen-lg mx-auto bg-white border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-2 px-4 text-left border-r">NEO Name</th>
              <th className="py-2 px-4 text-left border-r">Min Estimated Diameter (km)</th>
              <th className="py-2 px-4 text-left border-r">Max Estimated Diameter</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((neo) => (
              <tr key={neo.id} className="border-t hover:bg-gray-100">
                <td className="py-2 px-4 border-r">{neo.name}</td>
                <td className="py-2 px-4 border-r">{neo.min_diameter.toFixed(3)}</td>
                <td className="py-2 px-4 border-r">{neo.max_diameter.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NEOTable;
