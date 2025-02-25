import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
    Button, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Paper 
} from "@mui/material";
import { ShoppingCart, Delete } from "@mui/icons-material"; // Icons
import ApiService from "../../services/ApiService";
import styled from "styled-components";

const SavedStockList: React.FC = () => {
    const [stocks, setStocks] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSavedStocks = async () => {
            try {
                const data = await ApiService.getSavedStocks();
                setStocks(data);
            } catch (err) {
                console.error("Error fetching saved stocks:", err);
                setError("Failed to load saved stocks.");
            }
        };

        fetchSavedStocks();
    }, []);

    const handleBuy = (tickerCode: string) => {
        navigate(`/order`);
    };

    const handleDelete = (tickerCode: string) => {
        navigate('/');
    };

    return (
        <StyledContainer>
            <h2> Your Saved Stocks</h2>

            {error && <ErrorText>{error}</ErrorText>}

            <TableContainer component={Paper} sx={{ maxWidth: 700, margin: "auto", mt: 2, borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
                <Table>
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell><strong>Ticker Code</strong></StyledTableCell>
                            <StyledTableCell><strong>Price</strong></StyledTableCell>
                            <StyledTableCell><strong>Actions</strong></StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {stocks.length > 0 ? (
                            stocks.map((tickerCode, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell>{tickerCode}</StyledTableCell>
                                    <StyledTableCell>$100</StyledTableCell>
                                    <StyledTableCell>
                                        <CoolButton variant="contained" onClick={() => handleBuy(tickerCode)} color="primary">
                                            <ShoppingCart fontSize="small" />
                                            Buy
                                        </CoolButton>
                                        <DeleteButton variant="contained" onClick={() => handleDelete(tickerCode)} sx={{ ml: 2 }}>
                                            <Delete fontSize="small" />
                                            Delete
                                        </DeleteButton>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))
                        ) : (
                            <StyledTableRow>
                                <StyledTableCell colSpan={3} style={{ textAlign: "center" }}>
                                    No saved stocks found.
                                </StyledTableCell>
                            </StyledTableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </StyledContainer>
    );
};

export default SavedStockList;

// 🖌 Styled Components for a Cooler UI
const StyledContainer = styled.div`
    max-width: 800px;
    margin: auto;
    text-align: center;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 12px;
`;

const ErrorText = styled.p`
    color: red;
    font-weight: bold;
`;

const StyledTableRow = styled(TableRow)`
    &:nth-of-type(odd) {
        background-color: #f9f9f9;
    }
`;

const StyledTableCell = styled(TableCell)`
    font-size: 16px;
    padding: 12px;
`;

const CoolButton = styled(Button)`
    margin-right: 8px;
    text-transform: none;
    border-radius: 20px;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 6px 12px;
    transition: all 0.3s ease;
    
    &:hover {
        transform: scale(1.05);
    }
`;

const DeleteButton = styled(CoolButton)`
    background-color: #d32f2f !important;
    color: white !important;
    &:hover {
        background-color: #b71c1c !important;
    }
`;
