import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
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

const NEOChart = () => {
  const [data, setData] = useState<NEO[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); 
  const [selectedBody, setSelectedBody] = useState<string>("Earth"); 

  useEffect(() => {
    const getData = async () => {
      try {
        const neoData = await fetchNEOData(); 
        if (!neoData.length) {
          setError(true); 
          setLoading(false);
          return;
        }

        // Transform data into the required format
        const transformedData = neoData.map((neo: NEO) => ({
          id: neo.id,
          name: neo.name,
          min_diameter: neo.estimated_diameter.kilometers.estimated_diameter_min,
          max_diameter: neo.estimated_diameter.kilometers.estimated_diameter_max,
          orbiting_body: neo.close_approach_data[0]?.orbiting_body,
        }));

        // Filter data based on selected orbiting body and sort by average diameter
        const filteredData = transformedData.filter((neo: NEO) => neo.orbiting_body === selectedBody);
        filteredData.sort((a: NEO, b: NEO) => (b.min_diameter + b.max_diameter) / 2 - (a.min_diameter + a.max_diameter) / 2);

        setData(filteredData); 
      } catch (err) {
        setError(true); 
        console.error("Error fetching NEO data:", err);
      }
      setLoading(false); 
    };

    getData();
  }, [selectedBody]); 


  if (loading) return <p className="text-center text-xl">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error fetching data</p>;

  return (
    <div>
      <h2 className="text-center text-2xl font-bold mb-4">Near-Earth Objects (NEO) Diameters</h2>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart layout="vertical" data={data}>
          <XAxis type="number" label={{ value: "Diameter (km)", position: "insideBottom", offset: -2 }} />
          <YAxis type="category" dataKey="name" width={150} label={{ value: "NEO Name", angle: -90, position: "insideLeft", offset: 2 }} tick={{ fontSize: 14 }} />
          <Tooltip />
          <Legend verticalAlign="top" align="center" />
          <Bar dataKey="min_diameter" fill="#4285F4" name="Min Estimated Diameter (km)" />
          <Bar dataKey="max_diameter" fill="#EA4335" name="Max Estimated Diameter (km)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NEOChart;
