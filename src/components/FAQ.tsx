import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "What is PayLog?",
    answer:
      "PayLog is a simple web app to track debts, balances, and generate invoices.",
    value: "item-1",
  },
  {
    question: "Is PayLog free to use?",
    answer:
      "Yes, PayLog is completely free to use for personal finance tracking.",
    value: "item-2",
  },
  {
    question: "Can I track both incoming and outgoing money?",
    answer:
      "Yes, PayLog allows you to track how much you owe and how much others owe you.",
    value: "item-3",
  },
  {
    question: "Can I generate invoices as PDFs?",
    answer:
      "Yes, you can create and download invoices as PDFs easily from the dashboard.",
    value: "item-4",
  },
  {
    question: "Do I need to sign up?",
    answer: "Yes, PayLog uses Clerk authentication to keep your data secure.",
    value: "item-5",
  },
];

export const FAQSection = () => {
  return (
    <section
      id="faq"
      className="container py-24 sm:py-32 flex justify-center"
    >
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
            FAQS
          </h2>

          <h2 className="text-3xl md:text-4xl text-center font-bold">
            Common Questions
          </h2>
        </div>

        {/* Centering Accordion */}
        <div className="w-full">
          <Accordion
            type="single"
            collapsible
            className="w-full"
          >
            {FAQList.map(({ question, answer, value }) => (
              <AccordionItem
                key={value}
                value={value}
              >
                <AccordionTrigger className="text-left">
                  {question}
                </AccordionTrigger>
                <AccordionContent>{answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
