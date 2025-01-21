<script lang="ts">
  import FileUpload from '@/components/FileUpload.vue';
  import { defineComponent, ref, provide } from 'vue';

  export default defineComponent({
    name: "HomeView",
    components: {
      FileUpload,
    },
    data() {
      return {
        notMutualsVis: true,
        followRequestsVis: true
      }
    },
    methods: {
      toggleMutualsView() { this.notMutualsVis = !this.notMutualsVis; console.log(this.following) },
      toggleFollowRequestsView() { this.followRequestsVis = !this.followRequestsVis; }
    },
    setup() {
      // Global state for JSON data
      const following = ref<any>(null); 
      const followers = ref<any>(null);
      const notMutuals = ref<any>(null);

      const sentFollowRequests = ref<any>(null);
      const fileErr = ref<any[]>([]);

      // Provide global state
      provide('following', following);
      provide('followers', followers);
      provide('notMutuals', notMutuals);

      provide('sentFollowRequests', sentFollowRequests);
      provide('fileErr', fileErr);

      return {
        following, followers, sentFollowRequests, fileErr, notMutuals
      };
    },
  })
</script>

<template>
  <main class="flex justify-center">
    <div class="grid xl:w-1/2 px-4 lg:px-0 gap-6">
      <h1 class="mt-6 text-3xl font-bold uppercase text-left">
        <span class="opacity-75">Welcome to</span> <span class="underline decoration-blue-700">InstaMutuals</span>
      </h1>

      <div class="bg-zinc-800 text-zinc-600 rounded-md p-4">
        <h1 class="text-xl font-bold uppercase text-white">Upload your Instagram data</h1>
        <h2 class="text-lg font-semibold">Please upload your data to be analysed.</h2>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-4 mt-4">
          <div class="rounded-md outline outline-2 p-2 outline-zinc-900" 
          :class="{'outline-blue-700': following, 'outline-red-700': fileErr?.includes('following.json'), 'opacity-50 pointer-events-none': following}">
            <span class="font-bold uppercase text-sm">Upload following.json</span>
            <div>
              <FileUpload fileRequired="following.json"/>
            </div>
          </div>

          <div class="rounded-md outline outline-2 p-2 outline-zinc-900" 
          :class="{'outline-blue-700': followers, 'outline-red-700': fileErr?.includes('followers_1.json'), 'opacity-50 pointer-events-none': followers}">
            <span class="font-bold uppercase text-sm">Upload followers_1.json</span>
            <div>
              <FileUpload fileRequired="followers_1.json"/>
            </div>
          </div>

        </div>
      </div>

      <div class="bg-zinc-800 text-zinc-500 rounded-md p-4">
        <div class="w-full lg:flex items-center">
          <div>
            <h1 class="text-xl font-bold uppercase text-white">Not Mutual People</h1>
            <h2 class="text-lg font-semibold">Here is everyone that does not follow you back.</h2>
          </div>

          <div class="ml-auto mt-2 lg:mt-0">
            <button class="px-4 lg:px-8 py-1 lg:py-2 bg-blue-700 hover:opacity-75 duration-150 text-white rounded-md"
            @click="toggleMutualsView">
              {{ notMutualsVis ? 'Hide' : 'View' }}
            </button>
          </div>
        </div>

        <div v-if="notMutualsVis" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2" :class="{'mt-4': notMutuals?.data?.length > 0}">
          <a v-for="(user, index) in notMutuals?.data" :key="index" :href="'https://instagram.com/' + user" target="_blank">
            <div class="bg-zinc-900 hover:opacity-75 duration-150 rounded overflow-hidden">
              <h1 class="font-bold p-4">
                @{{ user }}
              </h1>
            </div>
          </a>
        </div>
      </div>

      <div class="bg-zinc-800 text-zinc-500 rounded-md p-4">
        <div class="w-full lg:flex items-center">
          <div>
            <h1 class="text-xl font-bold uppercase text-white">Follow Requests</h1>
            <h2 class="text-lg font-semibold">Here is everyone you sent a follow request that is still pending</h2>
          </div>

          <div class="ml-auto mt-2 lg:mt-0">
            <button class="px-4 lg:px-8 py-1 lg:py-2 bg-blue-700 hover:opacity-75 duration-150 text-white rounded-md"
            @click="toggleFollowRequestsView">
              {{ followRequestsVis ? 'Hide' : 'View' }}
            </button>
          </div>
        </div>

        <div class="rounded-md outline outline-2 p-2 outline-zinc-900 mt-4" 
          :class="{'outline-blue-700': sentFollowRequests, 'outline-red-700': fileErr?.includes('pending_follow_requests.json'), 'opacity-50 pointer-events-none': sentFollowRequests}">
            <span class="font-bold uppercase text-sm">Upload pending_follow_requests.json</span>
            <div>
              <FileUpload fileRequired="pending_follow_requests.json"/>
            </div>
        </div>

        <div v-if="followRequestsVis" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2" :class="{'mt-4': sentFollowRequests?.data?.length > 0}">
          <a v-for="(user, index) in sentFollowRequests?.data" :key="index" :href="'https://instagram.com/' + user.username" target="_blank">
            <div class="bg-zinc-900 hover:opacity-75 duration-150 rounded overflow-hidden">
              <h1 class="font-bold p-4">
                @{{ user.username }}
              </h1>
            </div>
          </a>
        </div>
      </div>
    </div>
  </main>
</template>
