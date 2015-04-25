# Read more about app structure at http://docs.appgyver.com

module.exports =

  # See styling options for tabs and other native components in app/common/native-styles/ios.css or app/common/native-styles/android.css
  tabs: [
    {
      title: "Clicks"
      id: "index"
      location: "event#index" 
    }
    {
      title: "Map"
      id: "map"
      location: "map#index" # URLs are supported!
    }
    {
      title: "Profile"
      id: "profile"
      location: "event#login" # URLs are supported!
    }
    
    
  ]

  # rootView:
  #   location: "events#index"

  preloads: [
    {
      id: "map"
      location: "map#index"
    }
  ]

  # drawers:
  #   left:
  #     id: "leftDrawer"
  #     location: "example#drawer"
  #     showOnAppLoad: false
  #   options:
  #     animation: "swingingDoor"
  #
  # initialView:
  #   id: "initialView"
  #   location: "example#initial-view"
