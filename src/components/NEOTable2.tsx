import React, { useEffect, useState } from "react";
import { fetchNEOData } from "../services/NEOService";


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

const NEOTable2: React.FC = () => {
  const [data, setData] = useState<NEO[]>([]);
  const [filteredData, setFilteredData] = useState<NEO[]>([]);
  const [selectedBody, setSelectedBody] = useState<string>("Earth");
  const [orbitingBodies, setOrbitingBodies] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

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
      setFilteredData(transformed.filter((neo: NEO) => neo.orbiting_body === selectedBody));
    };

    getData();
  }, []);

  useEffect(() => {
    const newFiltered = data.filter((neo) => neo.orbiting_body === selectedBody);
    setFilteredData(newFiltered);
  }, [selectedBody, data]);

  return (
    <div>
      <h2 className="text-center text-3xl font-extrabold mb-6 text-indigo-600">NASA’s NEO Data</h2>

      <div className="container mx-auto mb-6 p-4">
        <div className="relative flex items-center space-x-4">
          <span className="text-lg text-gray-700 font-medium">Orbiting Body:</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-8"> 
          {orbitingBodies
            .filter((body) => body.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((body) => (
              <button
                key={body}
                onClick={() => setSelectedBody(body)}
                className={`py-2 px-6 rounded-lg text-sm font-semibold focus:outline-none transition duration-300 ease-in-out 
                  ${selectedBody === body 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-200 hover:bg-indigo-500 hover:text-white border border-transparent hover:border-indigo-500'}`} // Bouton non sélectionné
              >
                {body}
              </button>
            ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto bg-white rounded-lg shadow-lg border border-gray-300">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="py-3 px-6 text-left">NEO Name</th>
              <th className="py-3 px-6 text-left">Min Diameter (km)</th>
              <th className="py-3 px-6 text-left">Max Diameter (km)</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((neo) => (
              <tr
                key={neo.id}
                className="border-t transition-all duration-300 hover:bg-indigo-50"
              >
                <td className="py-3 px-6">{neo.name}</td>
                <td className="py-3 px-6">{neo.min_diameter.toFixed(3)}</td>
                <td className="py-3 px-6">{neo.max_diameter.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NEOTable2;
