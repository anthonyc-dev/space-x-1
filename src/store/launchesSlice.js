import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "https://api.spacexdata.com/v4/launches/query";

export const fetchLaunches = createAsyncThunk(
  "launches/fetchLaunches",
  async ({ page = 1, query = "" } = {}, { rejectWithValue }) => {
    try {
      const limit = 12;
      const offset = (page - 1) * limit;

      const queryObj = query
        ? {
            $or: [
              { name: { $regex: query, $options: "i" } },
              { "rocket.name": { $regex: query, $options: "i" } },
            ],
          }
        : {};

      const optionsObj = {
        limit,
        offset,
        sort: { date_utc: "desc" },
        populate: ["rocket"],
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryObj, options: optionsObj }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch launches");
      }

      const result = await response.json();

      console.log("Show data", result);

      return {
        data: result.docs,
        hasMore: result.hasNextPage || false,
        page,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  launches: [],
  loading: false,
  error: null,
  hasMore: true,
  page: 1,
  query: "",
  initialLoad: true,
};

const launchesSlice = createSlice({
  name: "launches",
  initialState,
  reducers: {
    resetLaunches: (state) => {
      state.launches = [];
      state.page = 1;
      state.hasMore = true;
      state.error = null;
    },
    setQuery: (state, action) => {
      state.query = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLaunches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLaunches.fulfilled, (state, action) => {
        state.loading = false;
        state.initialLoad = false;

        if (action.payload.page === 1) {
          state.launches = action.payload.data;
        } else {
          state.launches = [...state.launches, ...action.payload.data];
        }

        state.hasMore = action.payload.hasMore;
        state.page = action.payload.page;
      })
      .addCase(fetchLaunches.rejected, (state, action) => {
        state.loading = false;
        state.initialLoad = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetLaunches, setQuery } = launchesSlice.actions;
export default launchesSlice.reducer;
