import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, View, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ConservationMain from './ConservationMain';
import CategoryConservation from './CategoryConservation';
import AddConservation from './AddConservation';
import JarConservation from './JarConservation';

const Tab = createBottomTabNavigator();

// icon with a circle 
const TabIcon = ({ source, focused, style }: { source: any; focused: boolean; style?: any }) => {
  return (
    <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
      <Image source={source} style={[styles.icon, style]} />
    </View>
  );
};

export default function ConservationNavigation() {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      {/* TABS*/}
      <Tab.Screen
        name="HomeTab"
        component={ConservationMain}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              source={
                focused
                  ? require('../../../assets/icons/home_black.png')
                  : require('../../../assets/icons/home.png')
              }
            />
          ),
        }}
      />
      <Tab.Screen
        name="SavedTab"
        component={CategoryConservation}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              source={
                focused
                  ? require('../../../assets/icons/bookmark_black.png')
                  : require('../../../assets/icons/bookmark.png')
              }
            />
          ),
        }}
      />
      <Tab.Screen
        name="AddTab"
        component={AddConservation}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              source={
                focused
                  ? require('../../../assets/icons/add_black.png')
                  : require('../../../assets/icons/add.png')
              }
            />
          ),
        }}
      />
      <Tab.Screen
        name="JarTab"
        component={JarConservation}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              style={styles.jarIcon}
              source={
                focused
                  ? require('../../../assets/icons/jar_black.png')
                  : require('../../../assets/icons/jar.png')
              }
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  // whole tab bar style
  tabBar: {
    height: hp(12),       
    paddingBottom: hp(1.5),  
    paddingTop: hp(2),       
    alignItems: 'center',
    justifyContent: 'center',
  },

  // tab icon containers
  iconContainer: {
    width: hp(6),          
    height: hp(6),           
    borderRadius: hp(3),     
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { // tab icons
    width: hp(3),            
    height: hp(3),
  },
  // jar icon has to be bigger
  jarIcon: { 
    width: hp(2.5),          
    height: hp(4),           
  },

  // blue circle for active tab
  activeIconContainer: {
    backgroundColor: '#00B4BF66',
  },
});
