import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ticketMessagesAPI } from '../../services/api'; // ✅ Correct axios instance

interface Message {
  message_id: number;
  ticket_id: number;
  sender_id: number;
  content: string;
  created_at: string;
}

interface MessageState {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

const initialState: MessageState = {
  messages: [],
  loading: false,
  error: null,
};

// 🔄 GET messages by ticket ID
export const fetchMessagesByTicketId = createAsyncThunk<Message[], number, { rejectValue: string }>(
  'ticketMessages/fetchByTicketId',
  async (ticketId, { rejectWithValue }) => {
    try {
      const res = await ticketMessagesAPI.getMessagesByTicketId(ticketId); // ✅ uses api.ts
      if (!Array.isArray(res.data)) {
        return rejectWithValue('Invalid response format');
      }
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch messages');
    }
  }
);

// 📨 POST a new message
export const sendMessage = createAsyncThunk<
  Message,
  { ticket_id: number; sender_id: number; content: string },
  { rejectValue: string }
>(
  'ticketMessages/send',
  async (data, { rejectWithValue }) => {
    try {
      const res = await ticketMessagesAPI.sendMessage(data); // ✅ uses api.ts
      if (!res.data || !res.data.message_id) {
        return rejectWithValue('Invalid message format returned from server');
      }
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to send message');
    }
  }
);

const messageSlice = createSlice({
  name: 'ticketMessages',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.messages = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Messages
      .addCase(fetchMessagesByTicketId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessagesByTicketId.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessagesByTicketId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Unknown error occurred';
      })

      // Send Message
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload ?? 'Unknown error occurred';
      });
  },
});

export const { clearMessages } = messageSlice.actions;
export default messageSlice.reducer;
