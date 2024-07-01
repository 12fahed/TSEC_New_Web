import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DownloadTableRow from "@/components/DownloadTableRow";
import { BatchElement } from "@/app/dashboard/downloads/page";


interface DownloadTableProps {
  batches: BatchElement[];
  date: any[];
  handleDownloadBatchCSV: (batchIndex: number, fileName: string) => void;
  theme: string;
}

const DownloadTable: React.FC<DownloadTableProps> = ({ batches, date, handleDownloadBatchCSV, theme }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Batch</TableHead>
          <TableHead>Actions</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {batches.length > 0 ? (
          batches.map((batch, index) => (
            <DownloadTableRow
              key={index}
              index={index}
              batch={batch}
              date={date[index]}
              handleDownloadBatchCSV={handleDownloadBatchCSV}
              theme={theme}
            />
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={2} className="px-6 py-4 text-gray-600">No enquiries available.</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default DownloadTable;
