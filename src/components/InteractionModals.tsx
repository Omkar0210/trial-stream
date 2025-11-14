import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface FollowModalProps {
  isOpen: boolean;
  onClose: () => void;
  researcherName: string;
  onConfirm: () => void;
}

export const FollowModal = ({ isOpen, onClose, researcherName, onConfirm }: FollowModalProps) => {
  const { toast } = useToast();

  const handleFollow = () => {
    onConfirm();
    toast({
      title: "Researcher Followed",
      description: `You are now following ${researcherName}. You'll receive updates about their latest research.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Follow {researcherName}</DialogTitle>
          <DialogDescription>
            Stay updated with {researcherName}'s latest publications, clinical trials, and research activities.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleFollow}>Follow</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface NudgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  researcherName: string;
}

export const NudgeModal = ({ isOpen, onClose, researcherName }: NudgeModalProps) => {
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleNudge = () => {
    toast({
      title: "Invitation Sent",
      description: `Your invitation to join CuraLink has been sent to ${researcherName}.`,
    });
    setMessage("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invite {researcherName} to CuraLink</DialogTitle>
          <DialogDescription>
            Send a personalized invitation to {researcherName} to join the CuraLink platform for collaboration.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="message">Personal Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Add a personal note to your invitation..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleNudge}>Send Invitation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface MeetingRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  researcherName: string;
  researcherEmail?: string;
}

export const MeetingRequestModal = ({ isOpen, onClose, researcherName, researcherEmail }: MeetingRequestModalProps) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("30");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleRequest = () => {
    if (!date || !time) {
      toast({
        title: "Missing Information",
        description: "Please select a date and time for the meeting.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Meeting Request Sent",
      description: `Your meeting request has been sent to ${researcherName}. You'll receive a confirmation email.`,
    });
    
    // Reset form
    setDate("");
    setTime("");
    setDuration("30");
    setMessage("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Request Meeting with {researcherName}</DialogTitle>
          <DialogDescription>
            Schedule a virtual or in-person meeting to discuss collaboration opportunities.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Preferred Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Preferred Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 hour</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="meeting-message">Message</Label>
            <Textarea
              id="meeting-message"
              placeholder="Briefly describe what you'd like to discuss..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleRequest}>Send Request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface SendMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  researcherName: string;
}

export const SendMessageModal = ({ isOpen, onClose, researcherName }: SendMessageModalProps) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSend = () => {
    if (!subject || !message) {
      toast({
        title: "Missing Information",
        description: "Please provide both a subject and message.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Message Sent",
      description: `Your message has been sent to ${researcherName}.`,
    });
    
    setSubject("");
    setMessage("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Send Message to {researcherName}</DialogTitle>
          <DialogDescription>
            Reach out to discuss collaboration opportunities or ask questions.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Brief subject line"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="msg-content">Message</Label>
            <Textarea
              id="msg-content"
              placeholder="Write your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSend}>Send Message</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface CollaborationRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  researcherName: string;
}

export const CollaborationRequestModal = ({ isOpen, onClose, researcherName }: CollaborationRequestModalProps) => {
  const [projectTitle, setProjectTitle] = useState("");
  const [description, setDescription] = useState("");
  const [expertise, setExpertise] = useState("");
  const { toast } = useToast();

  const handleRequest = () => {
    if (!projectTitle || !description) {
      toast({
        title: "Missing Information",
        description: "Please provide project title and description.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Collaboration Request Sent",
      description: `Your collaboration request has been sent to ${researcherName}. They will review and respond soon.`,
    });
    
    setProjectTitle("");
    setDescription("");
    setExpertise("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Request Collaboration with {researcherName}</DialogTitle>
          <DialogDescription>
            Propose a research collaboration or partnership opportunity.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="project-title">Project Title</Label>
            <Input
              id="project-title"
              placeholder="Name of your research project or initiative"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expertise-needed">Expertise Needed</Label>
            <Input
              id="expertise-needed"
              placeholder="e.g., Deep Brain Stimulation, Clinical Trials"
              value={expertise}
              onChange={(e) => setExpertise(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your project, goals, and how the researcher can contribute..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleRequest}>Send Request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
