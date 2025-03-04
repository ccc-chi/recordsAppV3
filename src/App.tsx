import { useEffect, useState } from "react";
import { Button } from "@chakra-ui/react";
import { Records } from "./domain/records";
import { getAllRecords } from "../utils/supabaseFunctions";

function App() {
  const [records, setRecords] = useState<Records[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const getRecords = async () => {
      const data = await getAllRecords();
      setRecords(data);
      setLoading(false);
    };
    getRecords();
  }, []);
  return (
    <>
      <div>
        <h1>Vite</h1>
        <Button>ボタン</Button>
        <ul>
          {loading ? (
            <p>loading...</p>
          ) : (
            records.map((record) => (
              <li key={record.id}>
                {record.title} {record.time}
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
}

export default App;
