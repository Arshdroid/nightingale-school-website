import React, { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import {
  GradeLevel,
  SCHOOL_INFO,
  validateInquiryForm,
} from '../utils/schoolData';

const GRADES: GradeLevel[] = ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];

export const ContactAndFooterSection: React.FC = () => {
  const [studentName, setStudentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [gradeApplying, setGradeApplying] = useState<GradeLevel>('Grade 7');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateInquiryForm({
      studentName,
      parentPhone,
      gradeApplying,
      message,
    });
    if (!result.valid) {
      setError(result.error ?? 'Please check your input.');
      setSubmitted(false);
      return;
    }
    setError(null);
    setSubmitted(true);
  };

  return (
    <>
      <section
        id="contact"
        className="w-full bg-[#ECEEF2] py-16 lg:py-24 border-b border-neutral-200"
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Exact School & Block D Contact Information */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-2">
                Get in Touch · {SCHOOL_INFO.blockName} &amp; Main Office
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
                {SCHOOL_INFO.fullName}
              </h2>
            </div>

            <div className="space-y-4 text-base text-neutral-800">
              <div className="glass-card-light p-4 flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-neutral-700 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-neutral-500">
                    Campus Address
                  </p>
                  <p className="font-medium text-neutral-900 mt-0.5">{SCHOOL_INFO.address}</p>
                </div>
              </div>

              <div className="glass-card-light p-4 flex items-start gap-3.5">
                <Phone className="w-5 h-5 text-neutral-700 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-neutral-500">
                    Main School Telephone
                  </p>
                  <p className="font-mono-tabular font-medium text-neutral-900 mt-0.5">
                    <a href="tel:015435663" className="hover:underline">
                      015435663
                    </a>
                    ,{' '}
                    <a href="tel:015430743" className="hover:underline">
                      015430743
                    </a>
                  </p>
                </div>
              </div>

              <div className="glass-card-light p-4 flex items-start gap-3.5">
                <Phone className="w-5 h-5 text-neutral-700 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-neutral-500">
                    Block D Direct Contact (Grades 7 – 10)
                  </p>
                  <p className="font-mono-tabular font-medium text-neutral-900 mt-0.5">
                    <a href="tel:015451791" className="hover:underline">
                      {SCHOOL_INFO.blockDPhone}
                    </a>
                  </p>
                </div>
              </div>

              <div className="glass-card-light p-4 flex items-start gap-3.5">
                <Mail className="w-5 h-5 text-neutral-700 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-neutral-500">
                    Official Email
                  </p>
                  <p className="font-medium text-neutral-900 mt-0.5">
                    <a href={`mailto:${SCHOOL_INFO.email}`} className="hover:underline">
                      {SCHOOL_INFO.email}
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wider">
              <a
                href={SCHOOL_INFO.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-pill-light px-5 py-2.5 rounded-full text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors"
              >
                Facebook
              </a>
              <a
                href={SCHOOL_INFO.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-pill-light px-5 py-2.5 rounded-full text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors"
              >
                YouTube
              </a>
            </div>
          </div>

          {/* Right Column: Admission & Block D Inquiry Form */}
          <div className="lg:col-span-6 glass-card-light p-6 sm:p-8">
            <h3 className="font-display text-2xl font-bold text-neutral-900">
              Admission &amp; Block D Inquiry
            </h3>
            <p className="text-sm text-neutral-600 mt-1">
              Submit an inquiry for Grades 7–10 or schedule a campus visit at Kopundole, Lalitpur.
            </p>

            {submitted ? (
              <div className="mt-6 p-6 rounded-2xl border border-neutral-300 bg-neutral-100 space-y-3">
                <p className="font-display text-lg font-bold text-neutral-900">
                  Inquiry Recorded for {studentName}
                </p>
                <p className="text-sm text-neutral-700">
                  Thank you. Our {gradeApplying} coordinator in Block D will reach out to{' '}
                  <span className="font-mono-tabular font-semibold">{parentPhone}</span>, or you
                  may call us directly at{' '}
                  <span className="font-mono-tabular font-semibold">{SCHOOL_INFO.blockDPhone}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setStudentName('');
                    setParentPhone('');
                    setMessage('');
                  }}
                  className="px-4 py-2 rounded-full bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
                <div>
                  <label
                    htmlFor="student-name"
                    className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5"
                  >
                    Student Full Name
                  </label>
                  <input
                    id="student-name"
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter student full name"
                    className="w-full px-4 py-2.5 rounded-2xl bg-white border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="parent-phone"
                      className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5"
                    >
                      Parent / Guardian Phone
                    </label>
                    <input
                      id="parent-phone"
                      type="tel"
                      required
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      placeholder="e.g. 98XXXXXXXX or 01-5451791"
                      className="w-full px-4 py-2.5 rounded-2xl bg-white border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="grade-applying"
                      className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5"
                    >
                      Grade (Block D)
                    </label>
                    <select
                      id="grade-applying"
                      value={gradeApplying}
                      onChange={(e) => setGradeApplying(e.target.value as GradeLevel)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-white border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
                    >
                      {GRADES.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="inquiry-message"
                    className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5"
                  >
                    Message or Questions
                  </label>
                  <textarea
                    id="inquiry-message"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Questions regarding admission, bus routes, or Block D schedules..."
                    className="w-full px-4 py-2.5 rounded-2xl bg-white border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900"
                  />
                </div>

                {error && (
                  <p role="alert" className="text-xs font-semibold text-red-700">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Quiet Footer */}
      <footer className="w-full bg-[#F4F5F7] text-neutral-600 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <img
              src={SCHOOL_INFO.logoSrc}
              alt="Nightingale Logo"
              referrerPolicy="no-referrer"
              className="w-6 h-6 object-contain rounded-full"
            />
            <span>
              © {SCHOOL_INFO.fullName} · {SCHOOL_INFO.address}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#about" className="hover:text-neutral-900">
              About Us
            </a>
            <a href="#schedules" className="hover:text-neutral-900">
              Schedules
            </a>
            <a href="#faculty" className="hover:text-neutral-900">
              Faculty
            </a>
            <a href="#announcements" className="hover:text-neutral-900">
              Announcements
            </a>
            <a href="#contact" className="hover:text-neutral-900">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};
