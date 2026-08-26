import { useEffect, useState } from 'react';
import { fetchProfile, updateProfile } from '../api/api';
import { useAuth } from '../context/AuthContext';

const emptyProfile = {
  username: '',
  email: '',
  mobile_number: '',
  interests: '',
  age: '',
};

function Profile() {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchProfile();
        setProfile({
          username: data.username || '',
          email: data.email || '',
          mobile_number: data.mobile_number || '',
          interests: data.interests || '',
          age: data.age ?? '',
        });
      } catch (requestError) {
        setError(requestError.message || 'Unable to load your profile.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((currentProfile) => ({ ...currentProfile, [name]: value }));
    setMessage('');
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const updatedProfile = await updateProfile({
        email: profile.email,
        mobile_number: profile.mobile_number,
        interests: profile.interests,
        age: profile.age === '' ? null : Number(profile.age),
      });
      setProfile({
        username: updatedProfile.username || '',
        email: updatedProfile.email || '',
        mobile_number: updatedProfile.mobile_number || '',
        interests: updatedProfile.interests || '',
        age: updatedProfile.age ?? '',
      });
      updateUser(updatedProfile);
      setMessage('Profile updated successfully.');
    } catch (requestError) {
      setError(requestError.message || 'Unable to update your profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <main className="form-wrapper"><p>Loading your profile...</p></main>;
  }

  return (
    <main className="form-wrapper profile-wrapper">
      <p className="eyebrow profile-eyebrow">Student account</p>
      <h1>Your profile</h1>
      <p className="profile-intro">Keep your personal details up to date.</p>
      <form className="user-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="username">Username</label>
          <input id="username" name="username" value={profile.username} readOnly />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={profile.email} onChange={handleChange} />
        </div>
        <div className="profile-fields">
          <div className="form-group">
            <label className="form-label" htmlFor="mobile_number">Mobile number</label>
            <input id="mobile_number" name="mobile_number" type="tel" value={profile.mobile_number} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="age">Age</label>
            <input id="age" name="age" type="number" min="1" max="130" value={profile.age} onChange={handleChange} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="interests">Interests</label>
          <textarea id="interests" name="interests" rows="4" value={profile.interests} onChange={handleChange} placeholder="Tell us what you enjoy learning" />
        </div>
        {error && <p className="error" role="alert">{error}</p>}
        {message && <p className="success" role="status">{message}</p>}
        <button className="primary-button" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </main>
  );
}

export default Profile;
