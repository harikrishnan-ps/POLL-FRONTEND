export interface TeamDto {
  id: number;
  name: string;
  logoUrl?: string;
  voteCount: number;
  votePercentage: number;
}

export interface CreateTeamDto {
  name: string;
  logoUrl?: string;
}

export interface PollDto {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  isActive: boolean;
  resultsRevealed: boolean;
  totalVotes: number;
  teams: TeamDto[];
  hasVoted: boolean;
  votedTeamId: number | null;
  isAnonymous: boolean;
  voteDetails?: { username: string; teamName: string }[];
}

export interface CreatePollDto {
  title: string;
  description: string;
  isAnonymous: boolean;
  teams: CreateTeamDto[];
}

export interface VoteDto {
  pollId: number;
  teamId: number;
}
