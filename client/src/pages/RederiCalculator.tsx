import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { RouteData } from "@/models/types";
import { ChangeEvent, useEffect, useState } from "react";

const previousResultsLocalStorayeKey = "previousResults";
const previousInputLocalStorateKey = "input"

const RederiCalculator = () => {
  const [results, setResults] = useState<RouteData[]>([]);
  const [previousResults, setPreviousResults] = useState<RouteData[]>([]);
  const [input, setInput] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  useEffect(() => {
    const previousDataJson = localStorage.getItem(previousResultsLocalStorayeKey);
    const previousInput = localStorage.getItem(previousInputLocalStorateKey);
    if (previousInput) setInput(previousInput);
    if (previousDataJson !== null) setPreviousResults(JSON.parse(previousDataJson) as RouteData[])
  }, []);

  const calculatePaymentPerMinute = () => {
    const lines = input.split('\n').slice(1);
    const data = lines.map(line => {
      const parts = line.split('\t');
      const route = parts[0];
      const payment = parseInt(parts[1].replace(/\s+kr/g, '').replace(/\s/g, ''), 10);
      const timeParts = parts[2].split(', ').map(time => parseInt(time, 10));
      const hours = timeParts.length === 2 ? timeParts[0] : 0;
      const minutes = timeParts.length === 2 ? timeParts[1] : timeParts[0];
      const totalMinutes = hours * 60 + minutes;
      const paymentPerMinute = payment / totalMinutes;
      return { route, payment, totalMinutes, paymentPerMinute };
    });

    data.sort((a, b) => a.paymentPerMinute > b.paymentPerMinute ? -1 : 1);
    setResults(data);
    const prevResult = localStorage.getItem(previousResultsLocalStorayeKey);
    if (prevResult !== null) setPreviousResults(JSON.parse(prevResult));
    localStorage.setItem(previousInputLocalStorateKey, input);
    localStorage.setItem(previousResultsLocalStorayeKey, JSON.stringify(data));
  };

  return (
    <header className="flex items-center flex-col w-[80%] m-auto gap-10">
      <h1>Fraktekalkulator - Betaling per minutt</h1>
      <Textarea
        value={input}
        onChange={handleInputChange}
        placeholder="Lim inn rute-data her.."
        className="resize-none h-80 w-96"
      />
      <Button onClick={calculatePaymentPerMinute}>Beregn Betaling per Minutt</Button>

      {results.length > 0 && <section className="result">
        <Table className="">
          <TableHeader>
            <TableRow>
              <TableHead>Rute</TableHead>
              <TableHead>TotalBetaling</TableHead>
              <TableHead>Total Varighet</TableHead>
              <TableHead>Betaling per Minutt</TableHead>
              {previousResults.length > 0 && <TableHead>Endring fra sist</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result, index) => (
              <TableRow key={index}>
                <TableCell>{result.route}</TableCell>
                <TableCell>{result.payment.toLocaleString()} kr</TableCell>
                <TableCell>{result.totalMinutes} minutter</TableCell>
                <TableCell>{result.paymentPerMinute.toFixed(2)} kr</TableCell>
                {previousResults.length > 0 && <TableCell style={{ color: `${result.paymentPerMinute - previousResults[index].paymentPerMinute < 0 ? 'red' : ''}` }}>{(result.paymentPerMinute - previousResults[index].paymentPerMinute).toFixed(2)} kr</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>}
    </header>
  )
}

export default RederiCalculator;