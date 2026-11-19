import React, { useState } from 'react';
import { Check, Copy, Mail, Phone } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  BLOCK_D_FACULTY,
  GradeLevel,
  OFFICIAL_TIMINGS,
  SCHOOL_INFO,
  SeasonSchedule,
  getScheduleForGrade,
} from '../utils/schoolData';

const GRADES: GradeLevel[] = ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];

export const ScheduleAndFacultySection: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('Grade 7');
  const [season, setSeason] = useState<SeasonSchedule>('summer');
  const [copiedPhone, setCopiedPhone] = useState(false);

  const periods = getScheduleForGrade(selectedGrade, season);
  const timings = OFFICIAL_TIMINGS[season];

  const handleCopyBlockPhone = async () => {
    try {
      await navigator.clipboard.writeText(SCHOOL_INFO.blockDPhone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } catch {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  return (
    <section
      id="schedules"
      className="w-full bg-[#ECEEF2] py-16 lg:py-24 border-b border-neutral-200/80"
    >
      <div className="max-w-7xl mx-auto px-6 space-y-20">
        {/* Part 1: Block D Class Schedules (Grades 7 to 10) */}
        <div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-neutral-300/80">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-2">
                Block D Academic Timetable · {timings.label}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
                Class Schedules (Grades 7 – 10)
              </h2>
            </div>

            {/* Grade Selector & Season Toggle */}
            <div className="flex flex-wrap items-center gap-3">
              <div
                role="tablist"
                aria-label="Select Grade Level"
                className="flex flex-wrap items-center gap-1.5"
              >
                {GRADES.map((grade) => {
                  const active = grade === selectedGrade;
                  return (
                    <button
                      key={grade}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setSelectedGrade(grade)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-neutral-900 text-white border-neutral-900'
                          : 'glass-pill-light text-neutral-700 hover:text-neutral-900 hover:border-neutral-400'
                      }`}
                    >
                      {grade}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center rounded-full border border-neutral-300 p-0.5 bg-white/80">
                <button
                  type="button"
                  onClick={() => setSeason('summer')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    season === 'summer' ? 'bg-neutral-900 text-white' : 'text-neutral-700'
                  }`}
                >
                  Summer
                </button>
                <button
                  type="button"
                  onClick={() => setSeason('winter')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    season === 'winter' ? 'bg-neutral-900 text-white' : 'text-neutral-700'
                  }`}
                >
                  Winter
                </button>
              </div>
            </div>
          </div>

          {/* Official Dismissal & Bus Shift Strip (From Official School Notice) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 py-6">
            <div className="glass-card-light p-4">
              <p className="text-xs text-neutral-500">Block-D Dismissal</p>
              <p className="font-mono-tabular text-lg font-bold text-neutral-900 mt-1">
                {timings.blockDDismissal}
              </p>
            </div>
            <div className="glass-card-light p-4">
              <p className="text-xs text-neutral-500">Block-C Dismissal</p>
              <p className="font-mono-tabular text-lg font-bold text-neutral-900 mt-1">
                {timings.blockCDismissal}
              </p>
            </div>
            <div className="glass-card-light p-4">
              <p className="text-xs text-neutral-500">Block-B Dismissal</p>
              <p className="font-mono-tabular text-lg font-bold text-neutral-900 mt-1">
                {timings.blockBDismissal}
              </p>
            </div>
            <div className="glass-card-light p-4">
              <p className="text-xs text-neutral-500">1st Shift Bus</p>
              <p className="font-mono-tabular text-lg font-bold text-neutral-900 mt-1">
                {timings.busShift1}
              </p>
            </div>
            <div className="glass-card-light p-4">
              <p className="text-xs text-neutral-500">2nd Shift Bus</p>
              <p className="font-mono-tabular text-lg font-bold text-neutral-900 mt-1">
                {timings.busShift2}
              </p>
            </div>
            <div className="glass-card-light p-4">
              <p className="text-xs text-neutral-500">Evening Extra-Class</p>
              <p className="font-mono-tabular text-lg font-bold text-neutral-900 mt-1">
                {timings.eveningExtraClass}
              </p>
            </div>
          </div>

          {/* Daily Timetable Table inside Smooth Rounded Glass Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedGrade}-${season}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="mt-2 overflow-x-auto glass-card-light"
            >
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 text-xs uppercase tracking-wider text-neutral-500">
                    <th className="py-4 px-5 font-semibold">Period</th>
                    <th className="py-4 px-5 font-semibold">Time ({season})</th>
                    <th className="py-4 px-5 font-semibold">Subject / Activity ({selectedGrade})</th>
                    <th className="py-4 px-5 font-semibold">Room / Venue</th>
                    <th className="py-4 px-5 font-semibold">Instructor / Incharge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200/70 text-sm text-neutral-800">
                  {periods.map((row) => (
                    <tr key={row.period} className="hover:bg-neutral-100/80 transition-colors">
                      <td className="py-3.5 px-5 font-semibold text-neutral-900 whitespace-nowrap">
                        {row.period}
                      </td>
                      <td className="py-3.5 px-5 font-mono-tabular text-neutral-800 whitespace-nowrap">
                        {row.activeTime}
                      </td>
                      <td className="py-3.5 px-5 font-medium text-neutral-900">{row.subject}</td>
                      <td className="py-3.5 px-5 text-neutral-600 whitespace-nowrap">{row.room}</td>
                      <td className="py-3.5 px-5 text-neutral-600">{row.instructor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Part 2: Teacher & Block D Contact Details (Exact from blocks.php?id=4) */}
        <div id="faculty" className="pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-neutral-300/80">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-2">
                Block D Administration &amp; Academic Leadership
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
                Teacher &amp; Incharge Contact Details
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-wider text-neutral-600">
                Block D Direct Contact:
              </span>
              <button
                type="button"
                onClick={handleCopyBlockPhone}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 text-white text-xs font-mono-tabular font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <span>{SCHOOL_INFO.blockDPhone}</span>
                {copiedPhone ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            {BLOCK_D_FACULTY.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ duration: 0.35, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="glass-card-light p-6 sm:p-7 flex flex-col justify-between gap-6 hover:border-orange-500/50 transition-colors"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                    {member.role} · {member.grade}
                  </p>
                  <h3 className="font-display text-2xl font-bold text-neutral-900 mt-2">
                    {member.name}
                  </h3>
                  <p className="text-sm text-neutral-600 mt-1">
                    {member.block} ({member.grade}) — {SCHOOL_INFO.fullName}
                  </p>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-neutral-200 text-sm">
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-neutral-500 shrink-0" aria-hidden="true" />
                    <a
                      href={`tel:${member.phone.replace(/[^0-9+]/g, '')}`}
                      className="font-mono-tabular text-neutral-900 hover:underline"
                    >
                      {member.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-neutral-500 shrink-0" aria-hidden="true" />
                    <a
                      href={`mailto:${member.email}`}
                      className="text-neutral-800 hover:underline truncate"
                    >
                      {member.email}
                    </a>
                  </div>
                  <p className="text-xs text-neutral-500 pt-1">{member.officeHours}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
