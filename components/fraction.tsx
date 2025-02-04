import { Input } from "@nextui-org/input";
import { Button, Table, TableBody, TableCell, TableHeader, TableRow } from "@nextui-org/react";

interface IFraction  {
    min: number
    max: number
    name: string
}

interface FractionProps {
    fractions: Array<IFraction>;
}


export function Fraction(fractions: Array<IFraction> ) {
    return (
        <div>
            {/* {fractions.map( fraction, index) => (
                <div key={index}>
                    <Table>
                        <TableHeader>
                            <Table.Column>Min</Table.Column>
                            <Table.Column>Max</Table.Column>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell  >

                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <div>
                        <Input type="number" placeholder="Min" />
                        <Input type="number" placeholder="Max" />
                        <input type="text" placeholder="Name" />
                        <Button>Add</Button>
                    </div>
                </div>
            ))} */}
        </div>
    );
};
// return (
//     <div>
//         <h1>Fraction</h1>
//     </div>
// )

// }