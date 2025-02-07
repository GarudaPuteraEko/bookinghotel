"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

type Listing = {
  id: string;
  imageSrc: string;
  title: string;
  description: string;
  category: string;
  price: number;
  roomCount: number;
  bathroomCount: number;
  guestCount: number;
  locationValue: string;
};

const Listings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredCategory, setFilteredCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null); // Untuk menyimpan listing yang dipilih untuk reservasi

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get<Listing[]>("/api/upload");
        setListings(response.data);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
    const interval = setInterval(fetchListings, 5000); // Refresh otomatis setiap 5 detik

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="text-center text-gray-500 text-lg">Loading...</div>;
  }

  // Mendapatkan daftar kategori unik dari data listings
  const categories = Array.from(new Set(listings.map((listing) => listing.category)));

  // Filter listing berdasarkan kategori yang dipilih
  const filteredListings = filteredCategory
    ? listings.filter((listing) => listing.category === filteredCategory)
    : listings;

  const handleReservationClick = (listing: Listing) => {
    setSelectedListing(listing);
  };

  const closeModal = () => {
    setSelectedListing(null); // Menutup modal
  };

  return (
    <div className="container mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
        Featured Listings
      </h2>

      {/* Filter Kategori */}
      <div className="flex justify-center space-x-3 mb-6 flex-wrap">
        <button
          className={`px-4 py-2 rounded-lg shadow-md ${
            !filteredCategory ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setFilteredCategory(null)}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-lg shadow-md ${
              filteredCategory === category ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setFilteredCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Daftar Listings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredListings.map((listing) => (
          <div
            key={listing.id}
            className="relative border rounded-lg shadow-lg overflow-hidden bg-white transform transition duration-300 hover:scale-105"
          >
            <div className="overflow-hidden group">
              {/* Gambar Listing yang bisa diklik */}
              <img
                src={listing.imageSrc}
                alt={listing.title}
                className="w-full h-48 object-cover transition-transform duration-500 transform group-hover:scale-110 cursor-pointer"
                onClick={() => handleReservationClick(listing)} // Ketika gambar diklik, buka modal
              />
            </div>
            <div className="p-4">
              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                {listing.category}
              </span>
              <h3 className="text-lg font-semibold text-gray-900 mt-2">{listing.title}</h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{listing.description}</p>
              <p className="text-sm text-gray-700">
                🏠 {listing.roomCount} rooms | 🚿 {listing.bathroomCount} baths | 👥 {listing.guestCount} guests
              </p>
              <p className="text-sm text-gray-500">📍 {listing.locationValue}</p>
              <p className="text-blue-500 font-semibold text-lg mt-2">${listing.price}/night</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal untuk Reservasi */}
      {selectedListing && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg transition-transform transform scale-95 group-hover:scale-100">
            {/* Gambar Listing yang Diperbesar */}
            <div className="mb-4">
              <img
                src={selectedListing.imageSrc}
                alt={selectedListing.title}
                className="w-full h-72 object-cover rounded-lg"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-800">{selectedListing.title}</h3>
            <p className="text-gray-600 mt-2">{selectedListing.description}</p>
            <div className="mt-4">
              <p className="text-sm text-gray-700">
                🏠 {selectedListing.roomCount} rooms | 🚿 {selectedListing.bathroomCount} baths | 👥 {selectedListing.guestCount} guests
              </p>
              <p className="text-sm text-gray-500">📍 {selectedListing.locationValue}</p>
              <p className="text-blue-500 font-semibold text-lg mt-2">${selectedListing.price}/night</p>
            </div>
            <div className="mt-4">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full p-2 border rounded-md mt-2"
              />
            </div>
            <div className="mt-4">
              <label className="block text-gray-700">Check-in Date</label>
              <input
                type="date"
                className="w-full p-2 border rounded-md mt-2"
              />
            </div>
            <div className="mt-4">
              <label className="block text-gray-700">Check-out Date</label>
              <input
                type="date"
                className="w-full p-2 border rounded-md mt-2"
              />
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Close
              </button>
              <button
                className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Reserve Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Listings;