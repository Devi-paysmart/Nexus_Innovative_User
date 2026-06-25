import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Upload, X, Paperclip, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { PageTransition } from "../components/common/PageTransition";
import { SectionReveal } from "../components/common/SectionReveal";

const careerSchema = z.object({
  name: z.string().min(2, "Enter your full name").regex(/^[A-Za-z\s]+$/, "Name must contain only alphabetic characters"),
  email: z.string().email("Enter a valid email address"),
  mobile: z.string().regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
  position: z.string().min(1, "Select a position").regex(/^[A-Za-z\s]+$/, "Position must contain only alphabetic characters"),
  notes: z.string().optional(),
});

type CareerForm = z.infer<typeof careerSchema>;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_CLIENT_API_KEY;

export function CareersPage() {
  const [submitted, setSubmitted] = useState(false);
  const [resume, setResume] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CareerForm>({
    resolver: zodResolver(careerSchema),
  });

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    const isPDFOrDoc = file.type === "application/pdf" || 
                       file.type === "application/msword" || 
                       file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    
    if (!isPDFOrDoc) {
      setResumeError("Please upload a PDF or Word document (.pdf, .doc, .docx)");
      setResume(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setResumeError("File size exceeds 10MB limit");
      setResume(null);
      return;
    }

    setResume(file);
    setResumeError(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeResume = () => {
    setResume(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: CareerForm) => {
    if (!resume) {
      setResumeError("Please upload your resume");
      return;
    }

    setSubmitError(null);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("mobile", data.mobile);
      formData.append("position", data.position);
      if (data.notes) {
        formData.append("notes", data.notes);
      }
      formData.append("resume", resume);

      const response = await fetch(`${API_BASE_URL}/api/v1/user/products/carrers_insert`, {
        method: "POST",
        headers: {
          "X-API-Key": API_KEY,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `Server error (${response.status})`);
      }

      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      );
    }
  };

  const inputClass =
    "w-full rounded-xl border border-ink/10 bg-cloud px-4 py-3 text-sm outline-none focus:border-gold-deep placeholder:text-ink/40 dark:border-paper/15 dark:bg-ink-soft dark:text-paper dark:placeholder:text-paper/40";
  const errorClass = "mt-1 text-xs text-red-500";

  return (
    <PageTransition>
      <div className="pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionReveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="eyebrow mb-4">Careers</p>
              <h1 className="font-display text-4xl text-ink dark:text-paper lg:text-6xl">
                Join the Nexus Team
              </h1>
              <p className="mt-4 text-ink/60 dark:text-paper/60">
                We are defining the future of premium corporate gifting. Join us in curating moments that foster corporate relationships.
              </p>
            </div>
          </SectionReveal>

          <div className="mx-auto max-w-2xl">
            {/* Application form */}
            <SectionReveal delay={0.1}>
              <div className="glass rounded-3xl p-8 shadow-luxe-sm dark:glass-dark">
                <h2 className="font-display text-2xl text-ink dark:text-paper mb-6 flex items-center justify-center gap-2">
                  <Mail size={20} className="text-gold-deep" /> Submit Application
                </h2>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center py-16 text-center"
                  >
                    <CheckCircle2 className="text-gold-deep animate-pulse" size={56} />
                    <p className="mt-4 font-display text-2xl text-ink dark:text-paper">
                      Application Submitted!
                    </p>
                    <p className="mt-2 text-sm text-ink/60 dark:text-paper/60">
                      Thank you for applying. Our talent team will review your profile and reach out shortly.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4">
                    <div>
                      <input 
                        className={inputClass} 
                        placeholder="Full name" 
                        {...register("name")} 
                        onInput={(e) => {
                          e.currentTarget.value = e.currentTarget.value.replace(/[^A-Za-z\s]/g, "");
                        }} 
                      />
                      {errors.name && <p className={errorClass}>{errors.name.message}</p>}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <input className={inputClass} type="email" placeholder="Email address" {...register("email")} />
                        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                      </div>
                      <div>
                        <input 
                          className={inputClass} 
                          type="tel" 
                          maxLength={10} 
                          placeholder="Mobile number" 
                          {...register("mobile")} 
                          onInput={(e) => {
                            e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
                          }} 
                        />
                        {errors.mobile && <p className={errorClass}>{errors.mobile.message}</p>}
                      </div>
                    </div>

                    <div>
                      <input
                        className={inputClass}
                        placeholder="Position interested in"
                        {...register("position")}
                        onInput={(e) => {
                          e.currentTarget.value = e.currentTarget.value.replace(/[^A-Za-z\s]/g, "");
                        }}
                      />
                      {errors.position && <p className={errorClass}>{errors.position.message}</p>}
                    </div>

                    {/* Resume Upload Drag & Drop Area */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-ink/45 dark:text-paper/45 mb-2">
                        Upload Resume (PDF, DOC, DOCX - Max 10MB)
                      </label>
                      
                      <div
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        onClick={triggerFileInput}
                        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                          dragActive 
                            ? "border-gold bg-gold/5" 
                            : "border-ink/10 dark:border-paper/10 hover:border-gold-deep hover:bg-gold/5"
                        }`}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          className="hidden"
                        />
                        
                        {!resume ? (
                          <>
                            <Upload className="text-gold-deep mb-3" size={32} />
                            <p className="text-sm font-medium text-ink dark:text-paper">
                              Drag & Drop your resume here, or <span className="text-gold-deep hover:underline">browse</span>
                            </p>
                          </>
                        ) : (
                          <div className="flex items-center gap-3 bg-gold/10 px-4 py-2.5 rounded-xl max-w-full">
                            <Paperclip className="text-gold-deep flex-shrink-0" size={18} />
                            <div className="text-left overflow-hidden">
                              <p className="text-xs font-semibold text-ink dark:text-paper truncate max-w-[200px]">
                                {resume.name}
                              </p>
                              <p className="text-[10px] text-ink/40 dark:text-paper/40">
                                {(resume.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeResume();
                              }}
                              className="p-1 hover:bg-ink/5 dark:hover:bg-paper/10 rounded-full transition-colors"
                              aria-label="Remove resume"
                            >
                              <X size={14} className="text-ink/60 dark:text-paper/60" />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {resumeError && <p className={errorClass}>{resumeError}</p>}
                    </div>

                    <div>
                      <textarea
                        className={inputClass}
                        rows={3}
                        placeholder="Why do you want to join Nexus? (Optional)"
                        {...register("notes")}
                      />
                    </div>

                    {submitError && (
                      <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                        {submitError}
                      </div>
                    )}

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full justify-center rounded-xl bg-gold-deep text-ink py-3 text-sm font-semibold transition-all hover:bg-gold hover:shadow-gold-glow cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? "Submitting…" : "Apply Now"}
                    </button>
                  </form>
                )}
              </div>
            </SectionReveal>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
