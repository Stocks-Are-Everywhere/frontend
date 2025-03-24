import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/AxiosInstance";
import { CompanySearchResponse } from "../../../types/CompanySearchResponse";
import SearchInput from "./SearchInput";
import SearchResults from "./SearchResults";

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<CompanySearchResponse[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch results on search term
  useEffect(() => {
    const fetchResults = async () => {
      if (searchTerm.length >= 1) {
        setIsLoading(true);
        try {
          const response = await axiosInstance.get<CompanySearchResponse[]>(
            `/api/companies/search?query=${searchTerm}`
          );
          setResults(response.data);
          setIsOpen(true);
        } catch (error) {
          console.error("Error fetching search results:", error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    };

    const debounceTimer = setTimeout(fetchResults, 200);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSelect = (company: CompanySearchResponse) => {
    navigate(`/order/${company.isuSrtCd}`, {
      state: { selectedCompany: company },
    });
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && results.length > 0) {
      handleSelect(results[0]);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-[400px] mx-auto">
      <SearchInput
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => searchTerm.length > 0 && setIsOpen(true)}
        onClear={() => setSearchTerm("")}
        onKeyDown={handleKeyDown}
      />
      <SearchResults
        isOpen={isOpen}
        isLoading={isLoading}
        results={results}
        onSelect={handleSelect}
      />
    </div>
  );
};

export default SearchBar;
