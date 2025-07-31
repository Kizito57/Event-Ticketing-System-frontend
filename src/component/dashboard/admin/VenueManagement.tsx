import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Building, Calendar, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { type RootState, type AppDispatch } from '../../../store/store';
import { fetchVenues, createVenue, updateVenue, deleteVenue } from '../../../store/slices/venueSlice';
import { API_BASE_URL } from '../../../services/api';

interface Venue {
  venue_id: number;
  name: string;
  address: string;
  capacity: number;
  image_url?: string;
}

interface Event {
  event_id: number;
  venue_id: number;
  title: string;
  date: string;
  time: string;
}

const VenueManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { venues } = useSelector((state: RootState) => state.venues) as { venues: Venue[] | null };
  const { events } = useSelector((state: RootState) => state.events) as { events: Event[] | null };

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    capacity: '',
  });
  const [viewingVenue, setViewingVenue] = useState<Venue | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<Venue | null>(null);

  useEffect(() => {
    dispatch(fetchVenues());
  }, [dispatch]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        toast.error('Only JPEG or PNG images are allowed');
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        toast.error('Image size must be less than 100MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', address: '', capacity: '' });
    setImageFile(null);
    setImagePreview('');
    setShowAddForm(false);
    setShowEditForm(false);
    setEditingVenue(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = editingVenue?.image_url || '';
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('file', imageFile);
        const uploadResponse = await fetch(`${API_BASE_URL}/api/upload`, {
          method: 'POST',
          body: uploadData,
        });
        if (!uploadResponse.ok) {
          throw new Error('Image upload failed: ' + (await uploadResponse.text()));
        }
        const result = await uploadResponse.json();
        if (!result.imageUrl) throw new Error('Invalid API response: missing imageUrl');
        imageUrl = result.imageUrl;
      }

      const venuePayload = {
        name: formData.name,
        address: formData.address,
        capacity: parseInt(formData.capacity),
        image_url: imageUrl,
      };

      if (editingVenue) {
        await dispatch(updateVenue({ id: editingVenue.venue_id, venueData: venuePayload })).unwrap();
        toast.success('Venue updated successfully');
         await dispatch(fetchVenues())
      } else {
        await dispatch(createVenue(venuePayload)).unwrap();
        toast.success('Venue created successfully');
         await dispatch(fetchVenues())
      }

      resetForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save venue');
    }
  };

  const handleEdit = (venue: Venue) => {
    setEditingVenue(venue);
    setFormData({
      name: venue.name,
      address: venue.address,
      capacity: venue.capacity.toString(),
    });
    setImagePreview(venue.image_url || '');
    setShowEditForm(true);
  };

  const handleDelete = async (venue: Venue) => {
    const hasEvents = events?.some((e) => e.venue_id === venue.venue_id);
    if (hasEvents) {
      toast.error('Cannot delete venue with existing events');
      return;
    }
    setShowDeleteModal(venue);
  };

  const confirmDelete = async (venue: Venue) => {
    try {
      await dispatch(deleteVenue(venue.venue_id)).unwrap();
      toast.success('Venue deleted');
         await dispatch(fetchVenues())
    } catch {
      toast.error('Failed to delete venue');
    } finally {
      setShowDeleteModal(null);
    }
  };

  const handleViewEvents = (venue: Venue) => {
    setViewingVenue(venue);
    setShowEventModal(true);
  };

  const getVenueStatus = (venueId: number) => {
    const futureEvents = events?.filter(
      (event) => event.venue_id === venueId && new Date(event.date) >= new Date()
    ) || [];
    return {
      isActive: futureEvents.length > 0,
    };
  };

  const filteredVenues = useMemo(() => {
    return (venues || []).filter((venue) => {
      const matchSearch =
        (venue.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (venue.address || '').toLowerCase().includes(searchTerm.toLowerCase());
      const { isActive } = getVenueStatus(venue.venue_id);
      const matchStatus =
        filterStatus === 'all' ||
        (filterStatus === 'active' && isActive) ||
        (filterStatus === 'inactive' && !isActive);
      return matchSearch && matchStatus;
    });
  }, [venues, searchTerm, filterStatus]);

  const venueStats = {
    total: venues?.length || 0,
    active: venues?.filter((v) => getVenueStatus(v.venue_id).isActive).length || 0,
  };

  const venueEvents = events?.filter((e) => e.venue_id === viewingVenue?.venue_id) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Venue Management</h2>
        <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Venue
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
        {[
          { label: 'Total Venues', value: venueStats.total, icon: Building, color: 'text-blue-600' },
          { label: 'Active Venues', value: venueStats.active, icon: Calendar, color: 'text-purple-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-base-100 border border-base-300 rounded-xl shadow p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-base-content/70">{label}</p>
              <p className="text-xl font-bold">{value}</p>
            </div>
            <Icon className={`h-8 w-8 ${color}`} />
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
        <div className="join">
          {(['all', 'active', 'inactive'] as const).map((status) => (
            <button
              key={status}
              className={`btn join-item ${filterStatus === status ? 'btn-active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-1/2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 h-5 w-5" />
          <input
            type="text"
            placeholder="Search venues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered pl-10 w-full"
          />
        </div>
      </div>

      <div className="overflow-x-auto mt-6">
        <table className="table table-zebra w-full bg-base-100 rounded-lg shadow">
          <thead>
            <tr>
              <th>Image</th>
              <th>ID</th>
              <th>Name</th>
              <th>Address</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVenues.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6">No venues found</td>
              </tr>
            ) : (
              filteredVenues.map((venue) => {
                const { isActive } = getVenueStatus(venue.venue_id);
                return (
                  <tr key={venue.venue_id}>
                    <td>
                      <div className="w-20 h-14 rounded overflow-hidden">
                        {venue.image_url ? (
                          <img
                            src={venue.image_url.startsWith('http') ? venue.image_url : `${API_BASE_URL}${venue.image_url}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-base-200 flex items-center justify-center text-sm text-base-content/50">
                            No Image
                          </div>
                        )}
                      </div>
                    </td>
                    <td>{venue.venue_id}</td>
                    <td>{venue.name}</td>
                    <td>{venue.address}</td>
                    <td>{(venue.capacity ?? 0).toLocaleString()}</td>
                    <td>
                      <span className={`badge ${isActive ? 'badge-success' : 'badge-ghost'}`}>
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleViewEvents(venue)}
                        className="btn btn-sm btn-ghost"
                        title="View Events"
                        aria-label={`View events for ${venue.name}`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(venue)}
                        className="btn btn-sm btn-ghost"
                        title="Edit Venue"
                        aria-label={`Edit ${venue.name}`}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(venue)}
                        className="btn btn-sm btn-ghost text-error"
                        title="Delete Venue"
                        aria-label={`Delete ${venue.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {(showAddForm || showEditForm) && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/50">
          <div className="card bg-white shadow-lg border border-base-300 max-w-2xl w-full mx-4 p-4 overflow-auto" style={{ maxHeight: '90vh' }}>
            <div className="card-body">
              <h3 className="card-title">{editingVenue ? 'Edit Venue' : 'Add New Venue'}</h3>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Venue Name</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Address</span>
                      </label>
                      <textarea
                        className="textarea textarea-bordered"
                        rows={3}
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Capacity</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        className="input input-bordered"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Venue Image</span>
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="file-input file-input-bordered w-full"
                      />
                    </div>
                    <div className="w-full">
                      <label className="label">
                        <span className="label-text">Preview</span>
                      </label>
                      <div className="w-full h-48 border-2 border-dashed border-base-300 rounded-lg overflow-hidden">
                        {imagePreview ? (
                          <img
                            src={imagePreview.startsWith('data:') ? imagePreview : `${API_BASE_URL}${imagePreview}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-base-content/50">
                            <p>No image uploaded</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-actions justify-end mt-6">
                  <button type="button" onClick={resetForm} className="btn btn-ghost">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingVenue ? 'Update Venue' : 'Add Venue'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showEventModal && viewingVenue && (
        <div className="fixed inset-0 z-51 bg-white/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral text-base-content max-w-2xl w-full p-6 rounded-lg shadow-xl relative border border-base-300">
            <h3 className="text-xl font-bold mb-4">Events at: {viewingVenue.name}</h3>
            <button
              onClick={() => setShowEventModal(false)}
              className="btn btn-sm btn-circle absolute top-4 right-4"
              aria-label="Close events modal"
            >
              ✕
            </button>
            {venueEvents.length === 0 ? (
              <p className="text-center text-base-content/60">No events at this venue.</p>
            ) : (
              <div className="overflow-x-auto max-h-96">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {venueEvents.map((event) => {
                      const isUpcoming = new Date(event.date) >= new Date();
                      return (
                        <tr key={event.event_id}>
                          <td>{event.title}</td>
                          <td>{new Date(event.date).toLocaleDateString()}</td>
                          <td>{event.time}</td>
                          <td>
                            <span className={`badge ${isUpcoming ? 'badge-success' : 'badge-ghost'}`}>
                              {isUpcoming ? 'Upcoming' : 'Past'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/50">
          <div className="bg-white p-4 border rounded shadow">
            <p>
              Are you sure you want to delete "<strong>{showDeleteModal.name}</strong>"?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="btn btn-outline"
                aria-label="Cancel deletion"
              >
                No
              </button>
              <button
                onClick={() => confirmDelete(showDeleteModal)}
                className="btn btn-primary"
                aria-label={`Confirm deletion of ${showDeleteModal.name}`}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VenueManagement;