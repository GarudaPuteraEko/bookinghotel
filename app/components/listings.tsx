'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { FaTag, FaDollarSign, FaBed, FaBath, FaUserFriends, FaRulerCombined, FaMapMarkerAlt } from 'react-icons/fa';

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
  size?: number;
};

const Listings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredCategory, setFilteredCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null); // Untuk menyimpan listing yang dipilih untuk reservasi
  const [editingListing, setEditingListing] = useState<Listing | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get<Listing[]>('/api/upload');
        setListings(response.data);
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
    const interval = setInterval(fetchListings, 5000); // Refresh otomatis setiap 5 detik
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (action: 'delete' | 'edit', listing: Listing) => {
    if (action === 'delete') {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to recover this listing!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
      });
      if (!result.isConfirmed) return;

      try {
        await axios.delete('/api/delete', { data: listing });
        setListings((prev) => prev.filter((item) => item.id !== listing.id));
        Swal.fire('Deleted!', 'Your listing has been deleted.', 'success');
      } catch (error) {
        console.error('Failed to delete listing:', error);
        Swal.fire('Error!', 'There was a problem deleting the listing.', 'error');
      }
    } else if (action === 'edit') {
      setEditingListing(listing);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingListing) return;

    try {
      await axios.put('/api/edit', editingListing);
      setListings((prev) => prev.map((item) => (item.id === editingListing.id ? editingListing : item)));
      setEditingListing(null);
      Swal.fire('Updated!', 'Your listing has been updated.', 'success');
    } catch (error) {
      console.error('Failed to update listing:', error);
      Swal.fire('Error!', 'There was a problem updating the listing.', 'error');
    }
  };

  return (
    <div className='container mx-auto px-6 py-10'>
      <h2 className='text-3xl font-bold text-gray-800 text-center mb-8'>Featured Listings</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {listings.map((listing) => (
          <div key={listing.id} className='flex flex-col'>
            <motion.div className='border rounded-lg shadow-lg p-4 bg-white cursor-pointer transition-all hover:shadow-xl' whileHover={{ scale: 1.02 }} onClick={() => setSelectedListing(listing)}>
              <motion.img src={listing.imageSrc} alt={listing.title} className='w-full h-56 object-cover rounded-md' />
              <h3 className='text-lg font-semibold mt-2'>{listing.title}</h3>
              <p className='text-sm text-gray-600 mb-2'>{listing.description}</p>
              <div className='mt-2 text-sm text-gray-500 space-y-1'>
                <p>
                  <FaTag className='text-yellow-500' /> <strong>Category:</strong> {listing.category}
                </p>
                <p>
                  <FaDollarSign className='text-green-500' /> <strong>Price:</strong> ${listing.price}
                </p>
                <p>
                  <FaBed className='text-blue-500' /> <strong>Rooms:</strong> {listing.roomCount}
                </p>
                <p>
                  <FaBath className='text-purple-500' /> <strong>Bathrooms:</strong> {listing.bathroomCount}
                </p>
                <p>
                  <FaUserFriends className='text-orange-500' /> <strong>Guests:</strong> {listing.guestCount}
                </p>
                <p>
                  <FaMapMarkerAlt className='text-red-500' /> <strong>Location:</strong> {listing.locationValue}
                </p>
                {listing.size && (
                  <p>
                    <FaRulerCombined className='text-gray-700' /> <strong>Size:</strong> {listing.size} sqft
                  </p>
                )}
              </div>
            </motion.div>
            <div className='mt-2'>
              <div className='border p-4 rounded-md bg-gray-100'>
                <div className='flex gap-4'>
                  <button className='bg-yellow-500 text-white px-4 py-2 rounded-md w-full' onClick={() => handleAction('edit', listing)}>
                    Edit
                  </button>
                  <button className='bg-red-500 text-white px-4 py-2 rounded-md w-full' onClick={() => handleAction('delete', listing)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedListing && (
        <div className='fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50'>
          <motion.div className='bg-white rounded-xl shadow-2xl p-6 w-[85%] sm:w-[480px] md:w-[500px] lg:w-[520px] relative'>
            <button className='absolute top-3 right-3 text-gray-600 hover:text-gray-900' onClick={() => setSelectedListing(null)}>
              ✖
            </button>
            <img src={selectedListing.imageSrc} alt={selectedListing.title} className='w-full h-40 object-cover rounded-lg shadow-md' />
            <h3 className='text-lg font-semibold mt-3'>{selectedListing.title}</h3>
            <p className='text-gray-600 text-sm mt-1'>{selectedListing.description}</p>

            <div className='mt-3 space-y-2 text-gray-700 text-sm'>
              <p>
                <FaTag className='text-yellow-500' /> <strong>Category:</strong> {selectedListing.category}
              </p>
              <p>
                <FaDollarSign className='text-green-500' /> <strong>Price:</strong> ${selectedListing.price}
              </p>
              <p>
                <FaBed className='text-blue-500' /> <strong>Rooms:</strong> {selectedListing.roomCount}
              </p>
              <p>
                <FaBath className='text-purple-500' /> <strong>Bathrooms:</strong> {selectedListing.bathroomCount}
              </p>
              <p>
                <FaUserFriends className='text-orange-500' /> <strong>Guests:</strong> {selectedListing.guestCount}
              </p>
              <p>
                <FaMapMarkerAlt className='text-red-500' /> <strong>Location:</strong> {selectedListing.locationValue}
              </p>
            </div>

            <div className='mt-3'>
              {selectedListing.locationValue && (
                <iframe className='w-full h-40 rounded-md' src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedListing.locationValue)}&t=&z=13&ie=UTF8&iwloc=&output=embed`} allowFullScreen loading='lazy'></iframe>
              )}
            </div>

            <div className='flex justify-end mt-4'>
              <button className='bg-green-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-700'>Reserve</button>
            </div>
          </motion.div>
        </div>
      )}

      {editingListing && (
        <div className='fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-96'>
            <h3 className='text-xl font-bold'>Edit Listing</h3>
            <input type='text' value={editingListing.title} onChange={(e) => setEditingListing({ ...editingListing, title: e.target.value })} className='w-full border p-2 mt-2 rounded-md' />
            <textarea value={editingListing.description} onChange={(e) => setEditingListing({ ...editingListing, description: e.target.value })} className='w-full border p-2 mt-2 rounded-md' />
            <input type='number' value={editingListing.price} onChange={(e) => setEditingListing({ ...editingListing, price: parseFloat(e.target.value) })} className='w-full border p-2 mt-2 rounded-md' placeholder='Price' />

            <div className='flex justify-end mt-4'>
              <button className='bg-gray-500 text-white px-4 py-2 rounded-md' onClick={() => setEditingListing(null)}>
                Cancel
              </button>
              <button className='bg-blue-600 text-white px-4 py-2 ml-2 rounded-md' onClick={handleSaveEdit}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Listings;
