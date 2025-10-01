"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  Mail,
  Globe,
  Edit3,
  Send,
  Sparkles,
  ArrowRight,
  FileSpreadsheet,
} from "lucide-react";
import * as XLSX from "xlsx";

type Step = "input" | "generated" | "editing";
type Mode = "basic" | "advanced";

interface EmailData {
  email: string;
  website: string;
  generatedContent: string;
  editInstructions?: string;
}

interface EmailRecord {
  email: string;
  website: string;
  status: "pending" | "sent" | "error";
  generatedContent?: string;
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("basic");
  const [step, setStep] = useState<Step>("input");
  const [loading, setLoading] = useState(false);
  const [emailData, setEmailData] = useState<EmailData>({
    email: "",
    website: "",
    generatedContent: "",
  });

  const [emailRecords, setEmailRecords] = useState<EmailRecord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

      const records: EmailRecord[] = jsonData.map((row) => ({
        email: row.email || row.Email || row.EMAIL || "",
        website:
          row.website || row.Website || row.WEBSITE || row.url || row.URL || "",
        status: "pending",
      }));

      setEmailRecords(records);
      setCurrentIndex(0);
    };
    reader.readAsBinaryString(file);
  };

  const handleStartBatchProcessing = async () => {
    if (emailRecords.length === 0) return;

    const currentRecord = emailRecords[0];
    setCurrentIndex(0);

    setEmailData({
      email: currentRecord.email,
      website: currentRecord.website,
      generatedContent: "",
    });

    await generateEmailForCurrentRecord(currentRecord);
  };

  const generateEmailForCurrentRecord = async (record: EmailRecord) => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockGeneratedEmail = `Betreff: Partnerschaftsmöglichkeit mit ${record.website}

Hallo,

ich hoffe, diese E-Mail erreicht Sie zur rechten Zeit. Ich habe ${record.website} erkundet und bin von Ihrem innovativen Ansatz und der Qualität Ihrer Arbeit beeindruckt.

Ich würde gerne eine potenzielle Partnerschaftsmöglichkeit besprechen, die für beide Organisationen von Vorteil sein könnte. Unsere Dienstleistungen könnten das ergänzen, was Sie bereits außergewöhnlich gut machen.

Wären Sie nächste Woche für ein kurzes Gespräch verfügbar, um dies weiter zu erkunden? Ich bin zuversichtlich, dass wir gemeinsam etwas Wertvolles schaffen könnten.

Mit freundlichen Grüßen,
[Ihr Name]`;

    setEmailData((prev) => ({
      ...prev,
      email: record.email,
      website: record.website,
      generatedContent: mockGeneratedEmail,
    }));
    setLoading(false);
    setStep("generated");
  };

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "basic") {
      if (!emailData.website) return;
    } else {
      if (!emailData.email || !emailData.website) return;
    }

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockGeneratedEmail = `Betreff: Partnerschaftsmöglichkeit mit ${emailData.website}

Hallo,

ich hoffe, diese E-Mail erreicht Sie zur rechten Zeit. Ich habe ${emailData.website} erkundet und bin von Ihrem innovativen Ansatz und der Qualität Ihrer Arbeit beeindruckt.

Ich würde gerne eine potenzielle Partnerschaftsmöglichkeit besprechen, die für beide Organisationen von Vorteil sein könnte. Unsere Dienstleistungen könnten das ergänzen, was Sie bereits außergewöhnlich gut machen.

Wären Sie nächste Woche für ein kurzes Gespräch verfügbar, um dies weiter zu erkunden? Ich bin zuversichtlich, dass wir gemeinsam etwas Wertvolles schaffen könnten.

Mit freundlichen Grüßen,
[Ihr Name]`;

    setEmailData((prev) => ({
      ...prev,
      generatedContent: mockGeneratedEmail,
    }));
    setLoading(false);
    setStep("generated");
  };

  const handleEdit = () => {
    setStep("editing");
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailData.editInstructions) return;

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const mockEditedEmail = `Betreff: Zusammenarbeitsmöglichkeit - ${
      emailData.website
    }

Hallo,

ich verfolge ${
      emailData.website
    } und bin wirklich beeindruckt von Ihren innovativen Lösungen und Ihrem Engagement für Exzellenz.

${
  emailData.editInstructions.includes("formal") ||
  emailData.editInstructions.includes("formell")
    ? "Ich möchte formell eine strategische Partnerschaft vorschlagen, die beiden Organisationen zugutekommen könnte."
    : "Ich denke, es könnte eine großartige Gelegenheit für uns geben, zusammenzuarbeiten und etwas Erstaunliches zu schaffen."
}

Ihre Expertise in diesem Bereich passt perfekt zu unseren Zielen, und ich glaube, wir könnten durch die Kombination unserer Stärken bemerkenswerte Ergebnisse erzielen.

Wären Sie daran interessiert, ein Gespräch zu vereinbaren, um diese Möglichkeit weiter zu erkunden?

Ich freue mich auf Ihre Antwort.

Mit freundlichen Grüßen,
[Ihr Name]`;

    setEmailData((prev) => ({
      ...prev,
      generatedContent: mockEditedEmail,
    }));
    setLoading(false);
    setStep("generated");
  };

  const handleSend = async () => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (emailRecords.length > 0) {
      setEmailRecords((prev) =>
        prev.map((r, idx) =>
          idx === currentIndex
            ? {
                ...r,
                status: "sent",
                generatedContent: emailData.generatedContent,
              }
            : r
        )
      );

      const nextIndex = currentIndex + 1;
      if (nextIndex < emailRecords.length) {
        setCurrentIndex(nextIndex);
        const nextRecord = emailRecords[nextIndex];

        setLoading(false);

        await generateEmailForCurrentRecord(nextRecord);
        return;
      } else {
        setLoading(false);
        alert(`Alle ${emailRecords.length} E-Mails erfolgreich versendet!`);

        setEmailData({
          email: "",
          website: "",
          generatedContent: "",
          editInstructions: "",
        });
        setEmailRecords([]);
        setCurrentIndex(0);
        setStep("input");
        return;
      }
    }

    setLoading(false);
    alert("E-Mail erfolgreich versendet!");

    setEmailData({
      email: "",
      website: "",
      generatedContent: "",
      editInstructions: "",
    });
    setStep("input");
  };

  const resetForm = () => {
    setEmailData({
      email: "",
      website: "",
      generatedContent: "",
      editInstructions: "",
    });
    setStep("input");
  };

  return (
    <main className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50 backdrop-blur-sm">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white text-balance">
              AI Lead Reaktivator
            </h1>
          </div>
          <p className="text-zinc-400 text-xl leading-relaxed max-w-2xl mx-auto">
            Generiere personalisierte E-Mails mithilfe von AI, um deine Leads zu
            sichern
          </p>
        </div>

        {emailRecords.length > 0 && step !== "input" && (
          <div className="mb-8 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">
                E-Mail {currentIndex + 1} von {emailRecords.length}
              </span>
              <Badge className="bg-blue-600 text-white">
                {emailRecords.filter((r) => r.status === "sent").length}{" "}
                versendet
              </Badge>
            </div>
            <div className="mt-3 w-full bg-zinc-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentIndex + 1) / emailRecords.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-6 mb-12">
          <div className="flex items-center gap-2">
            <Badge
              variant={step === "input" ? "default" : "secondary"}
              className="gap-2 px-4 py-2 text-sm font-medium bg-zinc-800 text-zinc-200 border-zinc-700"
            >
              <Mail className="h-4 w-4" />
              Eingabe
            </Badge>
          </div>
          <ArrowRight className="h-4 w-4 text-zinc-500" />
          <div className="flex items-center gap-2">
            <Badge
              variant={step === "generated" ? "default" : "secondary"}
              className="gap-2 px-4 py-2 text-sm font-medium bg-zinc-800 text-zinc-200 border-zinc-700"
            >
              <Sparkles className="h-4 w-4" />
              Generiert
            </Badge>
          </div>
          <ArrowRight className="h-4 w-4 text-zinc-500" />
          <div className="flex items-center gap-2">
            <Badge
              variant={step === "editing" ? "default" : "secondary"}
              className="gap-2 px-4 py-2 text-sm font-medium bg-zinc-800 text-zinc-200 border-zinc-700"
            >
              <Edit3 className="h-4 w-4" />
              Bearbeiten
            </Badge>
          </div>
        </div>

        {step === "input" && (
          <Card className="bg-zinc-900 border-zinc-700/50 shadow-2xl">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl text-white">
                <div className="p-2 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                E-Mail Generierung
              </CardTitle>
              <CardDescription className="text-base leading-relaxed text-zinc-400">
                Wähle zwischen Basic- und Advanced-Modus
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Tabs
                value={mode}
                onValueChange={(v) => setMode(v as Mode)}
                className="w-full"
              >
                <TabsList className=" w-full  mb-8 bg-zinc-800 border border-zinc-700">
                  <TabsTrigger
                    value="basic"
                    className="data-[state=active]:bg-zinc-700 text-white"
                  >
                    Basic Modus
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label
                        htmlFor="excel-upload"
                        className="flex items-center gap-2 text-base font-medium text-white"
                      >
                        <FileSpreadsheet className="h-4 w-4 text-green-400" />
                        Excel-Datei hochladen
                      </Label>
                      <div className="flex items-center gap-4">
                        <Input
                          id="excel-upload"
                          type="file"
                          accept=".xlsx,.xls,.csv"
                          onChange={handleFileUpload}
                          className="h-14 text-base bg-zinc-800 border-zinc-700 text-white file:mr-4 file:mt-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                        />
                      </div>
                      <p className="text-sm text-zinc-500">
                        Excel-Datei mit Spalten: "email" und "website"
                      </p>
                    </div>

                    {emailRecords.length > 0 && (
                      <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-white">
                            {emailRecords.length} E-Mails geladen
                          </span>
                          <Badge className="bg-green-600 text-white">
                            Bereit zum Starten
                          </Badge>
                        </div>
                        <div className="max-h-40 overflow-y-auto space-y-2">
                          {emailRecords.map((record, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-sm p-2 bg-zinc-900 rounded"
                            >
                              <span className="text-zinc-300 truncate flex-1">
                                {record.email} - {record.website}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {emailRecords.length > 0 ? (
                    <Button
                      onClick={handleStartBatchProcessing}
                      className="w-full h-14 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white border-0"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                          Generiere E-Mail...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-3 h-5 w-5" />
                          Verarbeitung starten
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleInitialSubmit}
                      className="w-full h-14 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white border-0"
                      disabled={loading || !emailData.website}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                          Generiere E-Mail...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-3 h-5 w-5" />
                          E-Mail generieren
                        </>
                      )}
                    </Button>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {step === "generated" && (
          <div className="space-y-8">
            <Card className="bg-zinc-900 border-zinc-700/50 shadow-2xl">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl text-white">
                  <div className="p-2 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  Generierte E-Mail
                </CardTitle>
                <CardDescription className="text-base leading-relaxed text-zinc-400">
                  Überprüfe deine E-Mail und bearbeite oder versende sie
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-6">
                  <div className="p-6 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                    <div className="text-sm text-zinc-400 mb-4 font-medium">
                      An: {emailData.email}
                    </div>
                    <pre className="whitespace-pre-wrap text-base leading-relaxed font-sans text-zinc-100">
                      {emailData.generatedContent}
                    </pre>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      onClick={handleSend}
                      className="flex-1 h-12 text-base bg-green-600 hover:bg-green-700 text-white border-0"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Wird versendet...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          {emailRecords.length > 0 &&
                          currentIndex < emailRecords.length - 1
                            ? "Versenden & Nächste"
                            : "E-Mail versenden"}
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleEdit}
                      variant="outline"
                      className="flex-1 h-12 text-base border-zinc-700 hover:bg-zinc-800 bg-transparent text-white"
                    >
                      <Edit3 className="mr-2 h-5 w-5" />
                      E-Mail bearbeiten
                    </Button>
                  </div>
                  {emailRecords.length === 0 && (
                    <Button
                      onClick={resetForm}
                      variant="ghost"
                      className="w-full h-12 text-base hover:bg-zinc-800 text-zinc-400 hover:text-white"
                    >
                      Neu starten
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === "editing" && (
          <Card className="bg-zinc-900 border-zinc-700/50 shadow-2xl">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl text-white">
                <div className="p-2 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                  <Edit3 className="h-6 w-6 text-white" />
                </div>
                Bearbeite deine E-Mail
              </CardTitle>
              <CardDescription className="text-base leading-relaxed text-zinc-400">
                Gib Informationen an oder bestimme Formate, wie die E-Mail
                aufgebaut werden soll
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <form onSubmit={handleEditSubmit} className="space-y-8">
                <div className="space-y-3">
                  <Label
                    htmlFor="instructions"
                    className="text-base font-medium text-white"
                  >
                    Bearbeitungsanweisungen
                  </Label>
                  <Textarea
                    id="instructions"
                    placeholder="z.B. Mache es formeller, füge einen spezifischen Call-to-Action hinzu, erwähne unsere neueste Produkteinführung..."
                    value={emailData.editInstructions || ""}
                    onChange={(e) =>
                      setEmailData((prev) => ({
                        ...prev,
                        editInstructions: e.target.value,
                      }))
                    }
                    required
                    rows={5}
                    className="resize-none text-base bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-500 focus:ring-zinc-500"
                  />
                </div>
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="flex-1 h-12 text-base bg-blue-600 hover:bg-blue-700 text-white border-0"
                    disabled={loading || !emailData.editInstructions}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Wende Änderungen an...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        E-Mail neu schreiben
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep("generated")}
                    variant="outline"
                    className="flex-1 h-12 text-base border-zinc-700 hover:bg-zinc-800 bg-transparent text-white"
                  >
                    Abbrechen
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
