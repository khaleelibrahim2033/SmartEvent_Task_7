import React, { useEffect, useState } from 'react';
import {
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams
} from 'react-router-dom';

import api from './api';


// ==============================
// Protected Route
// ==============================

function ProtectedRoute({ children }) {
  return localStorage.getItem('smartevent_token')
    ? children
    : <Navigate to="/login" replace />;
}


// ==============================
// Navbar
// ==============================

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('smartevent_token');

  const logout = () => {
    localStorage.removeItem('smartevent_token');
    localStorage.removeItem('smartevent_user');
    navigate('/login');
  };

  return (
    <nav className="nav">

      <Link className="brand" to="/">
        SmartEvent
      </Link>

      <div className="navlinks">

        <Link to="/">
          Events
        </Link>

        {token && (
          <>
            <Link to="/bookings">
              Bookings
            </Link>

            <Link to="/tickets">
              Tickets
            </Link>

            <Link to="/notifications">
              🔔 Notifications
            </Link>
          </>
        )}

        {!token ? (
          <Link to="/login">
            Login
          </Link>
        ) : (
          <button onClick={logout}>
            Logout
          </button>
        )}

      </div>

    </nav>
  );
}


// ==============================
// Authentication Page
// ==============================

function AuthPage({ mode }) {
  const isLogin = mode === 'login';
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    identifier: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  // ============================
  // Submit
  // ============================

  const submit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {

      // ========================
      // LOGIN
      // ========================

      if (isLogin) {

        const formData = new URLSearchParams();

        formData.append('username', form.identifier);
        formData.append('password', form.password);

        const res = await api.post(
          '/auth/login',
          formData,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        );

        localStorage.setItem(
          'smartevent_token',
          res.data.access_token
        );

        localStorage.setItem(
          'smartevent_user',
          JSON.stringify(res.data.user)
        );

      }

      // ========================
      // REGISTER
      // ========================

      else {

        await api.post('/auth/register', {
          username: form.username,
          email: form.email,
          password: form.password
        });


        // ======================
        // LOGIN AFTER REGISTER
        // ======================

        const formData = new URLSearchParams();

        formData.append('username', form.email);
        formData.append('password', form.password);

        const res = await api.post(
          '/auth/login',
          formData,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        );

        localStorage.setItem(
          'smartevent_token',
          res.data.access_token
        );

        localStorage.setItem(
          'smartevent_user',
          JSON.stringify(res.data.user)
        );
      }


      // ========================
      // GO HOME
      // ========================

      navigate('/');

    } catch (err) {

      console.error(
        'Login/Register error:',
        err
      );

      const detail = err.response?.data?.detail;

      if (Array.isArray(detail)) {

        setError(
          detail
            .map(
              (item) =>
                item.msg || 'Validation error'
            )
            .join(', ')
        );

      } else if (typeof detail === 'string') {

        setError(detail);

      } else {

        setError('Something went wrong');

      }

    } finally {

      setLoading(false);

    }
  };


  // ==============================
  // UI
  // ==============================

  return (
    <div className="auth card">

      <h1>
        {isLogin ? 'Login' : 'Create account'}
      </h1>

      <form onSubmit={submit}>

        {/* REGISTER USERNAME */}

        {!isLogin && (
          <input
            placeholder="Username"
            required
            minLength="3"
            value={form.username}
            onChange={(e) =>
              setForm({
                ...form,
                username: e.target.value
              })
            }
          />
        )}


        {/* LOGIN USERNAME / EMAIL */}

        {isLogin ? (

          <input
            placeholder="Username or email"
            required
            value={form.identifier}
            onChange={(e) =>
              setForm({
                ...form,
                identifier: e.target.value
              })
            }
          />

        ) : (

          <input
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value
              })
            }
          />

        )}


        {/* PASSWORD */}

        <input
          type="password"
          placeholder="Password"
          required
          minLength="6"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value
            })
          }
        />


        {/* ERROR */}

        {error && (
          <p className="error">
            {error}
          </p>
        )}


        {/* BUTTON */}

        <button disabled={loading}>

          {loading
            ? 'Please wait...'
            : isLogin
              ? 'Login'
              : 'Register'}

        </button>

      </form>


      {/* SWITCH LOGIN / REGISTER */}

      <p>

        {isLogin ? (

          <>
            New user?{' '}

            <Link to="/register">
              Register
            </Link>
          </>

        ) : (

          <>
            Already registered?{' '}

            <Link to="/login">
              Login
            </Link>
          </>

        )}

      </p>

    </div>
  );
}


// ==============================
// Home / Events
// ==============================

function Home() {

  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {

    setLoading(true);
    setError('');

    api.get('/events/', {
      params: {
        search: search || undefined,
        category: category || undefined
      }
    })

      .then((r) => {
        setEvents(r.data);
      })

      .catch((err) => {

        const detail = err.response?.data?.detail;

        if (Array.isArray(detail)) {
          setError(
            detail
              .map(
                (item) =>
                  item.msg || 'Validation error'
              )
              .join(', ')
          );
        } else if (typeof detail === 'string') {
          setError(detail);
        } else {
          setError('Unable to load events');
        }

      })

      .finally(() => {
        setLoading(false);
      });

  }, [search, category]);


  return (
    <>

      <section className="hero">

        <h1>
          Discover your next event
        </h1>

        <p>
          Find events, book tickets and keep
          your digital tickets in one place.
        </p>

      </section>


      <div className="toolbar">

        <input
          placeholder="Search events..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />


        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >

          <option value="">
            All categories
          </option>

          <option value="Music">
            Music
          </option>

          <option value="Tech">
            Tech
          </option>

          <option value="Sports">
            Sports
          </option>

          <option value="Business">
            Business
          </option>

        </select>

      </div>


      {error && (
        <p className="error">
          {error}
        </p>
      )}


      {loading ? (

        <p>
          Loading events...
        </p>

      ) : (

        <div className="grid">

          {events.map((event) => (

            <EventCard
              key={event.id}
              event={event}
            />

          ))}

        </div>

      )}


      {!loading && events.length === 0 && (
        <p>
          No events found.
        </p>
      )}

    </>
  );
}


// ==============================
// Event Card
// ==============================

function EventCard({ event }) {

  return (
    <Link
      className="event-card"
      to={`/events/${event.id}`}
    >

      <img
        src={event.banner_image}
        alt={event.title}
      />

      <div className="event-body">

        <span className="tag">
          {event.category}
        </span>

        <h2>
          {event.title}
        </h2>

        <p>
          📍 {event.location}
        </p>

        <p>
          📅 {new Date(
            event.event_date
          ).toLocaleString()}
        </p>

        <strong>
          ₹{event.ticket_price}
        </strong>

      </div>

    </Link>
  );
}


// ==============================
// Event Details
// ==============================

function EventDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');


  useEffect(() => {

    api.get(`/events/${id}`)

      .then((r) => {
        setEvent(r.data);
      })

      .catch((e) => {

        const detail = e.response?.data?.detail;

        if (Array.isArray(detail)) {
          setError(
            detail
              .map(
                (item) =>
                  item.msg || 'Validation error'
              )
              .join(', ')
          );
        } else if (typeof detail === 'string') {
          setError(detail);
        } else {
          setError('Event not found');
        }

      });

  }, [id]);


  const book = async () => {

    if (!localStorage.getItem('smartevent_token')) {
      navigate('/login');
      return;
    }


    try {

      const res = await api.post(
        '/bookings/',
        {
          event_id: Number(id),
          ticket_quantity: qty
        }
      );

      navigate(
        `/booking-confirmation/${res.data.id}`
      );

    } catch (e) {

      const detail = e.response?.data?.detail;

      if (Array.isArray(detail)) {
        setMessage(
          detail
            .map(
              (item) =>
                item.msg || 'Booking error'
            )
            .join(', ')
        );
      } else if (typeof detail === 'string') {
        setMessage(detail);
      } else {
        setMessage('Booking failed');
      }

    }
  };


  if (error) {

    return (
      <p className="error">
        {error}
      </p>
    );

  }


  if (!event) {
    return <p>Loading...</p>;
  }


  return (
    <div className="detail card">

      <img
        className="detail-image"
        src={event.banner_image}
        alt={event.title}
      />

      <span className="tag">
        {event.category}
      </span>

      <h1>
        {event.title}
      </h1>

      <p>
        {event.description}
      </p>

      <p>
        📍 {event.location}
      </p>

      <p>
        📅 {new Date(
          event.event_date
        ).toLocaleString()}
      </p>

      <h2>
        ₹{event.ticket_price}
      </h2>

      <p>
        {event.available_tickets} tickets available
      </p>


      <div className="book-row">

        <input
          type="number"
          min="1"
          max={Math.min(
            20,
            event.available_tickets
          )}
          value={qty}
          onChange={(e) =>
            setQty(Number(e.target.value))
          }
        />

        <button onClick={book}>
          Book Tickets
        </button>

      </div>


      {message && (
        <p className="error">
          {message}
        </p>
      )}

    </div>
  );
}


// ==============================
// Booking Confirmation
// ==============================

function BookingConfirmation() {

  const { id } = useParams();

  const [booking, setBooking] = useState(null);


  useEffect(() => {

    api.get(`/bookings/${id}`)

      .then((r) => {
        setBooking(r.data);
      });

  }, [id]);


  if (!booking) {
    return <p>Loading...</p>;
  }


  return (
    <div className="card">

      <h1>
        Booking Confirmed 🎉
      </h1>

      <p>
        Booking ID:{' '}

        <strong>
          #{booking.id}
        </strong>
      </p>

      <p>
        Status: {booking.booking_status}
      </p>

      <p>
        Quantity: {booking.ticket_quantity}
      </p>

      <h2>
        Total: ₹{booking.total_price}
      </h2>

      <Link
        className="button"
        to="/tickets"
      >
        View Digital Ticket
      </Link>

    </div>
  );
}


// ==============================
// Bookings
// ==============================

function Bookings() {

  const [items, setItems] = useState([]);


  useEffect(() => {

    api.get('/bookings/history')

      .then((r) => {
        setItems(r.data);
      });

  }, []);


  return (
    <div>

      <h1>
        Booking History
      </h1>

      <div className="list">

        {items.map((b) => (

          <div
            className="card"
            key={b.id}
          >

            <h3>
              Booking #{b.id}
            </h3>

            <p>
              Event ID: {b.event_id} ·
              Tickets: {b.ticket_quantity}
            </p>

            <p>
              Total: ₹{b.total_price} ·
              {' '}
              {b.booking_status}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}


// ==============================
// Tickets
// ==============================

function Tickets() {

  const [items, setItems] = useState([]);


  useEffect(() => {

    api.get('/tickets/')

      .then((r) => {
        setItems(r.data);
      });

  }, []);


  return (
    <div>

      <h1>
        My Digital Tickets
      </h1>

      <div className="grid">

        {items.map((t) => (

          <div
            className="ticket card"
            key={t.id}
          >

            <h2>
              Ticket
            </h2>

            <p>
              Code:{' '}

              <strong>
                {t.ticket_code}
              </strong>
            </p>

            <img
              src={t.qr_code_url}
              alt="Ticket QR code"
            />

            <p>
              Scan this QR code at event entry.
            </p>

          </div>

        ))}

      </div>


      {items.length === 0 && (
        <p>
          No tickets yet.
        </p>
      )}

    </div>
  );
}


// ==============================
// Notifications
// ==============================

function Notifications() {

  const [items, setItems] = useState([]);


  const load = () => {

    api.get('/notifications/')

      .then((r) => {
        setItems(r.data);
      });

  };


  useEffect(() => {
    load();
  }, []);


  const read = async (id) => {

    await api.patch(
      `/notifications/${id}/read`
    );

    load();
  };


  return (
    <div>

      <h1>
        Notifications
      </h1>


      {items.map((n) => (

        <div
          className={`card notification ${
            n.is_read ? 'read' : ''
          }`}
          key={n.id}
        >

          <h3>
            {n.title}
          </h3>

          <p>
            {n.message}
          </p>


          {!n.is_read && (

            <button
              onClick={() => read(n.id)}
            >
              Mark as read
            </button>

          )}

        </div>

      ))}


      {items.length === 0 && (
        <p>
          No notifications.
        </p>
      )}

    </div>
  );
}


// ==============================
// Main App
// ==============================

export default function App() {

  return (
    <>

      <Navbar />

      <main className="container">

        <Routes>

          {/* Home */}

          <Route
            path="/"
            element={<Home />}
          />


          {/* Login */}

          <Route
            path="/login"
            element={<AuthPage mode="login" />}
          />


          {/* Register */}

          <Route
            path="/register"
            element={<AuthPage mode="register" />}
          />


          {/* Event Details */}

          <Route
            path="/events/:id"
            element={<EventDetails />}
          />


          {/* Booking Confirmation */}

          <Route
            path="/booking-confirmation/:id"
            element={
              <ProtectedRoute>
                <BookingConfirmation />
              </ProtectedRoute>
            }
          />


          {/* Booking History */}

          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            }
          />


          {/* Tickets */}

          <Route
            path="/tickets"
            element={
              <ProtectedRoute>
                <Tickets />
              </ProtectedRoute>
            }
          />


          {/* Notifications */}

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />

        </Routes>

      </main>

    </>
  );
}