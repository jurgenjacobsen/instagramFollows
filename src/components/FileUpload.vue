<template>
    <input
        type="file"
        accept=".json"
        @change="handleFileUpload"
        class="rounded-md"
      />
</template>
  
<script lang="ts">
  // @ts-ignore
  import { defineComponent, ref, inject, Ref } from "vue";
  
  export default defineComponent({
    name: "FileUpload",
    props: {
      fileRequired: {
        type: String,
      }
    },
    setup(props) {
      const fileContent = ref<string | null>(null);
      
      const followingGlobal = inject("following") as Ref<any>;
      const followersGlobal = inject("followers") as Ref<any>;
      const notMutualsGlobal = inject("notMutuals") as Ref<any>;

      const sentFollowRequestsGlobal = inject("sentFollowRequests") as Ref<any>;
      const fileErr = inject("fileErr") as Ref<any>;

      const handleFileUpload = (event: Event) => {
        const input = event.target as HTMLInputElement;
        if (input?.files && input.files[0]) {
          const file = input.files[0];
          const reader = new FileReader();

          reader.onload = (e) => {

            const result = e.target?.result;
            if (typeof result === "string") {
              try {
                const parsedJson = JSON.parse(result);
                fileContent.value = JSON.stringify(parsedJson, null, 2);
                if(input?.files?.[0].name === "following.json" && props.fileRequired === "following.json") {

                  let i = fileErr?.value?.indexOf(props.fileRequired);
                  if (i !== -1) fileErr?.value?.splice(i,1);

                  console.log(fileErr.value)

                  followingGlobal.value = {
                    fileName: input.files[0].name,
                    data: parsedJson.relationships_following.map((f: any) => {
                      let d = f.string_list_data[0];
                      return {
                        username: d.value,
                        date: new Date(d.timestamp)
                      }
                    }),
                  };

                } else if(input?.files?.[0].name === "followers_1.json" && props.fileRequired === "followers_1.json") {

                  let i = fileErr?.value?.indexOf(props.fileRequired);
                  if (i !== -1) fileErr?.value?.splice(i,1);

                  followersGlobal.value = {
                    fileName: input.files[0].name,
                    data: parsedJson.map((f: any) => {
                      let d = f.string_list_data[0];
                      return {
                        username: d.value,
                        date: new Date(d.timestamp)
                      }
                    }),
                  };



                } else if(input?.files?.[0].name === "pending_follow_requests.json" && props.fileRequired === "pending_follow_requests.json") {

                  let i = fileErr?.value?.indexOf(props.fileRequired);
                  if (i !== -1) fileErr?.value?.splice(i,1);

                  sentFollowRequestsGlobal.value = {
                    fileName: input.files[0].name,
                    data: parsedJson.relationships_follow_requests_sent.map((f: any) => {
                      let d = f.string_list_data[0];
                      return {
                        username: d.value,
                        date: new Date(d.timestamp)
                      }
                    })
                  };


                } else {

                  if(Array.isArray(fileErr.value)) {
                    fileErr.value.push(props.fileRequired);
                  } else {
                    fileErr.value = [props.fileRequired];
                  }

                  alert("Invalid JSON file - Please upload following.json, followers_1.json or pending_follow_requests.json");
                  fileContent.value = null;
                }
              } catch (error) {
                alert("Invalid JSON file");
                fileContent.value = null;
              }
            }

            if(followingGlobal?.value?.data && followersGlobal?.value?.data) {
              let following = followingGlobal.value.data.map((f: any) => f.username);
              let followers = followersGlobal.value.data.map((f: any) => f.username);
              let notMutuals = [];

              for (let user of following) {
                if(!followers.includes(user)) {
                  notMutuals.push(user);
                }
              }

              notMutualsGlobal.value = {
                data: notMutuals,
              }

            }
          };
  
          reader.onerror = () => {
            alert("Error reading file");
            fileContent.value = null;
          };
  
          reader.readAsText(file);
        }
      };
  
      return {
        fileContent,
        handleFileUpload,
      };
    },
  });
</script>