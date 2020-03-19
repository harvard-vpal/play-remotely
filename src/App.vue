<template>
  <v-app id="inspire">
<!--     <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list dense>
        <v-list-item link to="/">
          <v-list-item-action>
            <v-icon>mdi-calendar-month</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Calendar</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/all-events">
          <v-list-item-action>
            <v-icon>mdi-view-list</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>All events</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/submit-event">
          <v-list-item-action>
            <v-icon>mdi-calendar-plus</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Submit event</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer> -->

    <v-app-bar
      app
      color="red darken-4"
      dark
    >
      <v-toolbar-title>Play Remotely</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <v-row class="mb-4">
          <v-col>
            <div class="d-flex align-center">
              <div>
                <v-btn-toggle borderless>
                  <v-btn value="calendar" to="/">
                    <span>Calendar</span>
                    <v-icon right>mdi-calendar-month</v-icon>
                  </v-btn>

                  <v-btn value="list" to="/all-events">
                    <span>All events</span>
                    <v-icon right>mdi-view-list</v-icon>
                  </v-btn>
                </v-btn-toggle>
              </div>

              <div class="ml-auto">
                <v-btn to="/submit-event" color="primary">
                  <v-icon left>mdi-calendar-plus</v-icon> Submit event
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <router-view />
          </v-col>
        </v-row>
      </v-container>
    </v-content>

    <v-footer
      color="red darken-4"
      app
    >
      <span class="white--text">footer</span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
    })
  }
</script>
