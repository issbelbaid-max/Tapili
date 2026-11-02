import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export const JobDetailScreen: React.FC = () => {
  const { jobs, selectedJobId, navigateTo, toggleJobTask, addJobTask, markJobComplete, showToast } = useApp();

  const job = jobs.find(j => j.id === selectedJobId) || jobs[0];

  const [isCodeRevealed, setIsCodeRevealed] = useState(false);
  const [isAdHocModalOpen, setIsAdHocModalOpen] = useState(false);
  const [adHocTitle, setAdHocTitle] = useState('');
  const [isPhotosOpen, setIsPhotosOpen] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCodeRevealed) {
      timer = setTimeout(() => {
        setIsCodeRevealed(false);
      }, 30000);
    }
    return () => clearTimeout(timer);
  }, [isCodeRevealed]);

  const completedTasks = job.tasks.filter(t => t.completed).length;
  const totalTasks = job.tasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const isDone = job.status === 'Completed';

  const handleAddAdHoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adHocTitle.trim()) return;
    addJobTask(job.id, adHocTitle.trim());
    setAdHocTitle('');
    setIsAdHocModalOpen(false);
  };

  return (
    <div className="flex flex-col w-full pb-32 max-w-lg mx-auto">
      {/* Top action header */}
      <div className="px-4 pt-3 flex items-center justify-between">
        <button
          onClick={() => navigateTo('jobs')}
          className="w-11 h-11 flex items-center justify-center rounded-full bg-[#eaedff] hover:bg-[#e2e7ff] text-[#131b2e] transition-colors cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => markJobComplete(job.id)}
            className={`h-7 px-3 rounded-full flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer ${
              isDone
                ? 'bg-[#86f2e4] text-[#006f66]'
                : 'bg-[#e2e7ff] text-[#3040b6]'
            }`}
          >
            {isDone ? (
              <>
                <span className="material-symbols-outlined text-[15px]">verified</span>
                <span className="text-[12px] font-semibold tracking-tight">Completed</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-[#3040b6] animate-pulse"></span>
                <span className="text-[12px] font-medium tracking-tight">In Progress</span>
              </>
            )}
          </button>
        </div>

        <button
          onClick={() => showToast('Edit Job details')}
          className="w-11 h-11 flex items-center justify-center rounded-full bg-[#eaedff] hover:bg-[#e2e7ff] text-[#454653] transition-colors cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">edit</span>
        </button>
      </div>

      {/* Hero Overview */}
      <div className="px-4 mt-3">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff]">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-[#006a61] font-medium tracking-wide uppercase">
                  Regular Client
                </span>
                <span className="inline-block w-1 h-1 rounded-full bg-[#c6c5d6]"></span>
                <span className="text-[12px] text-[#454653]">Fortnightly</span>
              </div>
              <h1 className="text-[24px] font-semibold text-[#131b2e] tracking-tight mt-0.5 truncate">
                {job.customerName}
              </h1>
              <p className="text-[14px] text-[#454653] mt-0.5">{job.serviceTitle}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#eaedff] flex items-center justify-center text-[#3040b6] shrink-0">
              <span className="material-symbols-outlined text-[26px]">cleaning_services</span>
            </div>
          </div>

          <div className="mt-3 pt-3 flex items-center gap-2 bg-[#f2f3ff] rounded-lg px-3 py-2.5">
            <span className="material-symbols-outlined text-[20px] text-[#3040b6]">schedule</span>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] text-[#131b2e] font-semibold">{job.dateLabel}</div>
              <div className="text-[13px] text-[#454653]">{job.timeWindow} (2 hrs scheduled)</div>
            </div>
            <span className="text-[12px] bg-white px-2 py-0.5 rounded text-[#006a61] font-semibold">
              Slot 1
            </span>
          </div>
        </div>
      </div>

      {/* Property Address & Map Strip */}
      <div className="px-4 mt-3">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] space-y-3">
          <div className="flex items-start gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-[#f2f3ff] flex items-center justify-center text-[#3040b6] shrink-0">
              <span className="material-symbols-outlined text-[20px]">location_on</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[12px] text-[#454653]">Service Property</div>
              <div className="text-[14px] text-[#131b2e] font-medium leading-snug mt-0.5">
                {job.propertyAddress}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <a
              href="tel:07700900123"
              className="h-12 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] transition-colors flex items-center justify-center gap-1.5 text-[#131b2e] text-[14px] font-medium"
            >
              <span className="material-symbols-outlined text-[19px] text-[#3040b6]">call</span>
              <span>Call</span>
            </a>
            <a
              href="https://wa.me/447700900123"
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] transition-colors flex items-center justify-center gap-1.5 text-[#131b2e] text-[14px] font-medium"
            >
              <span className="material-symbols-outlined text-[19px] text-[#006a61]">chat</span>
              <span>WhatsApp</span>
            </a>
            <button
              onClick={() => {
                showToast('Launching GPS Navigation...');
                window.open(`https://maps.apple.com/?q=${encodeURIComponent(job.propertyAddress)}`, '_blank');
              }}
              className="h-12 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] transition-colors flex items-center justify-center gap-1.5 text-[#131b2e] text-[14px] font-medium"
            >
              <span className="material-symbols-outlined text-[19px] text-[#6f4500]">near_me</span>
              <span>Maps</span>
            </button>
          </div>

          <div className="w-full h-28 bg-gradient-to-br from-[#3040b6] to-[#11249f] rounded-lg relative overflow-hidden flex items-end p-2.5">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="relative z-10 flex items-center justify-between w-full text-white">
              <div className="flex items-center gap-1.5 text-[13px]">
                <span className="material-symbols-outlined text-[16px] text-[#86f2e4]">navigation</span>
                <span>{job.travelEstimateTime || '8 mins away'} ({job.travelEstimateDistance || '2.1 mi'})</span>
              </div>
              <button
                onClick={() => {
                  showToast('Previewing route turn-by-turn...');
                  window.open(`https://maps.google.com/?q=${encodeURIComponent(job.propertyAddress)}`, '_blank');
                }}
                className="text-[12px] underline tracking-wide text-white hover:text-[#86f2e4]"
              >
                Preview Route
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Secure Access & Notes */}
      <div className="px-4 mt-3">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#503000]">vpn_key</span>
              <h2 className="text-[17px] font-semibold text-[#131b2e]">Secure Access & Notes</h2>
            </div>
            <span className="text-[12px] bg-[#ffddb8] text-[#2a1700] px-2 py-0.5 rounded-full font-medium">
              Verified
            </span>
          </div>

          <div className="mt-3">
            <div
              onClick={() => setIsCodeRevealed(!isCodeRevealed)}
              className="bg-[#f2f3ff] rounded-xl p-3 cursor-pointer transition-all active:scale-[0.99] select-none border border-[#eaedff]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#dae2fd] flex items-center justify-center text-[#454653] shrink-0">
                    <span className="material-symbols-outlined text-[18px]">
                      {isCodeRevealed ? 'lock_open' : 'lock'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[12px] text-[#454653]">Front Porch Master Lock</div>
                    <div className="text-[18px] tracking-widest text-[#131b2e] font-mono font-semibold">
                      {isCodeRevealed ? (job.lockboxCode || 'KEY - 4829') : '•••• ••••'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="h-8 px-3 rounded-full bg-[#dae2fd] text-[#131b2e] text-[12px] font-medium flex items-center gap-1 hover:bg-[#eaedff] transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isCodeRevealed ? 'visibility_off' : 'visibility'}
                  </span>
                  <span>{isCodeRevealed ? 'Hide' : 'Reveal'}</span>
                </button>
              </div>

              <div className="mt-2 text-[11px] text-[#454653] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">shield</span>
                <span>
                  {isCodeRevealed
                    ? 'Code visible. Auto-hides for customer security in 30s'
                    : 'Tap to reveal lockbox code (Auto-hides in 30s)'}
                </span>
              </div>
            </div>
          </div>

          {job.petNote && (
            <div className="mt-2.5 bg-[#f2f3ff] rounded-xl p-3 flex items-start gap-2.5 border border-[#eaedff]">
              <div className="w-8 h-8 rounded-lg bg-[#ffddb8] flex items-center justify-center text-[#2a1700] shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[18px]">pets</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[12px] text-[#454653]">Pet Protocol</div>
                <div className="text-[14px] text-[#131b2e] font-medium">
                  {job.petNote}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Task Checklist */}
      <div className="px-4 mt-3">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#3040b6]">checklist</span>
              <h2 className="text-[17px] font-semibold text-[#131b2e]">Task Checklist</h2>
            </div>
            <span className="text-[12px] bg-[#e2e7ff] px-2 py-0.5 rounded-full text-[#3040b6] font-semibold">
              {completedTasks} of {totalTasks} Done
            </span>
          </div>

          <div className="w-full h-1.5 bg-[#eaedff] rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-[#3040b6] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="space-y-1">
            {job.tasks.map(task => (
              <label
                key={task.id}
                onClick={() => toggleJobTask(job.id, task.id)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#f2f3ff] transition-colors cursor-pointer select-none"
              >
                <div className="w-5 h-5 rounded flex items-center justify-center transition-colors">
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center ${
                      task.completed
                        ? 'bg-[#3040b6] text-white'
                        : 'bg-[#dae2fd] text-transparent'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  </div>
                </div>
                <span
                  className={`text-[14px] flex-1 ${
                    task.completed ? 'text-[#454653] line-through' : 'text-[#131b2e]'
                  }`}
                >
                  {task.title}
                </span>
              </label>
            ))}
          </div>

          <button
            onClick={() => setIsAdHocModalOpen(true)}
            className="w-full mt-2 py-2 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-[#3040b6] text-[12px] font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Add Ad-hoc Task</span>
          </button>
        </div>
      </div>

      {/* Payment & Profit */}
      <div className="px-4 mt-3">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#006a61]">payments</span>
              <h2 className="text-[17px] font-semibold text-[#131b2e]">Payment & Profit</h2>
            </div>
            <span className="text-[12px] bg-[#86f2e4] text-[#006f66] px-2 py-0.5 rounded-full font-semibold">
              Pending Completion
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 text-center">
            <div className="bg-[#f2f3ff] rounded-xl p-2.5">
              <div className="text-[12px] text-[#454653]">Agreed Price</div>
              <div className="text-[18px] font-semibold text-[#131b2e] mt-1">£{job.price.toFixed(2)}</div>
            </div>
            <div className="bg-[#f2f3ff] rounded-xl p-2.5">
              <div className="text-[12px] text-[#454653]">Deposit</div>
              <div className="text-[18px] font-semibold text-[#131b2e] mt-1">£{job.depositPaid.toFixed(2)}</div>
            </div>
            <div className="bg-[#e2e7ff] rounded-xl p-2.5">
              <div className="text-[12px] text-[#3040b6] font-medium">Balance Due</div>
              <div className="text-[18px] text-[#11249f] font-bold mt-1">£{job.balanceDue.toFixed(2)}</div>
            </div>
          </div>

          <div className="mt-3 bg-[#f2f3ff] rounded-xl p-3 flex items-start gap-2.5 border border-[#eaedff]">
            <span className="material-symbols-outlined text-[18px] text-[#006a61] mt-0.5">calculate</span>
            <div className="min-w-0 flex-1">
              <div className="text-[12px] text-[#131b2e] font-semibold">Direct Job Cost Note</div>
              <div className="text-[13px] text-[#454653] mt-0.5">
                Estimated supplies & travel: <strong className="text-[#131b2e]">£{job.directCostEstimate.toFixed(2)}</strong> • Estimated Net Job Profit: <strong className="text-[#006a61] font-semibold">£{job.netProfitEstimate.toFixed(2)}</strong>
              </div>
              <div className="text-[13px] text-[#757685] mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">info</span>
                <span>Effective hourly net rate: £{job.hourlyRateEstimate.toFixed(2)}/hr</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Photos */}
      <div className="px-4 mt-3 mb-2">
        <div className="bg-white rounded-xl p-3.5 shadow-sm border border-[#eaedff] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#f2f3ff] flex items-center justify-center text-[#3040b6]">
              <span className="material-symbols-outlined text-[20px]">add_a_photo</span>
            </div>
            <div>
              <div className="text-[14px] text-[#131b2e] font-medium">Job Photos (Before & After)</div>
              <div className="text-[13px] text-[#454653]">{job.photosCount} photos attached by client</div>
            </div>
          </div>
          <button
            onClick={() => setIsPhotosOpen(true)}
            className="h-9 px-3 rounded-lg bg-[#e2e7ff] hover:bg-[#dae2fd] text-[#3040b6] text-[12px] font-semibold transition-colors cursor-pointer"
            type="button"
          >
            View ({job.photosCount})
          </button>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-16 left-0 right-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3 shadow-[0_-8px_20px_rgba(15,23,42,0.06)] border-t border-[#eaedff]">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button
            onClick={() => navigateTo('new-invoice')}
            className="h-12 flex-1 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] text-[14px] font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[19px] text-[#454653]">receipt_long</span>
            <span>Create Invoice</span>
          </button>
          <button
            onClick={() => markJobComplete(job.id)}
            className={`h-12 flex-1 rounded-xl text-white text-[14px] font-medium shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              isDone ? 'bg-[#006a61]' : 'bg-[#3040b6] hover:bg-[#11249f]'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isDone ? 'task_alt' : 'check_circle'}
            </span>
            <span>{isDone ? 'Job Completed' : 'Mark as Done'}</span>
          </button>
        </div>
      </div>

      {/* Modal: Add Ad-hoc Task */}
      {isAdHocModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-2xl border border-[#eaedff] animate-in zoom-in-95">
            <h3 className="text-[17px] font-semibold text-[#131b2e] mb-2">Add Ad-hoc Task</h3>
            <p className="text-[13px] text-[#454653] mb-4">
              Extra request from Charlotte on-site (e.g. oven racks, inside fridge, terrace sweep).
            </p>
            <form onSubmit={handleAddAdHoc} className="space-y-3">
              <input
                autoFocus
                type="text"
                value={adHocTitle}
                onChange={e => setAdHocTitle(e.target.value)}
                placeholder="e.g. Clean inside microwave"
                className="w-full h-11 px-3 rounded-xl bg-[#f2f3ff] text-[#131b2e] text-[14px] outline-none focus:ring-2 focus:ring-[#3040b6]"
              />
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdHocModalOpen(false)}
                  className="flex-1 h-11 rounded-xl bg-[#f2f3ff] text-[#454653] font-medium text-[13px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-[#3040b6] text-white font-medium text-[13px]"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Job Photos */}
      {isPhotosOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 w-full max-w-md shadow-2xl border border-[#eaedff] animate-in zoom-in-95 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
              <div>
                <h3 className="text-[16px] font-semibold text-[#131b2e]">Attached Property Photos</h3>
                <p className="text-[12px] text-[#454653]">42 Crescent Gardens • Arrival checklist</p>
              </div>
              <button
                onClick={() => setIsPhotosOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f2f3ff] text-[#454653] flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-3">
              <div className="flex flex-col gap-1">
                <div className="h-32 rounded-xl bg-[#eaedff] flex items-center justify-center overflow-hidden relative">
                  <span className="material-symbols-outlined text-[32px] text-[#3040b6]">countertops</span>
                  <span className="absolute bottom-1 left-2 text-[10px] font-bold bg-black/50 text-white px-1.5 rounded">
                    Kitchen Before
                  </span>
                </div>
                <span className="text-[11px] text-[#757685]">Uploaded by Charlotte</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="h-32 rounded-xl bg-[#e2e7ff] flex items-center justify-center overflow-hidden relative">
                  <span className="material-symbols-outlined text-[32px] text-[#006a61]">bathroom</span>
                  <span className="absolute bottom-1 left-2 text-[10px] font-bold bg-black/50 text-white px-1.5 rounded">
                    Shower Screen
                  </span>
                </div>
                <span className="text-[11px] text-[#757685]">Descale target area</span>
              </div>
            </div>
            <div className="pt-4">
              <button
                onClick={() => {
                  showToast('Photo upload simulation: Photo captured & stored');
                  setIsPhotosOpen(false);
                }}
                className="w-full h-11 bg-[#3040b6] text-white rounded-xl text-[13px] font-medium flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">camera_alt</span>
                <span>Snap New After Photo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
