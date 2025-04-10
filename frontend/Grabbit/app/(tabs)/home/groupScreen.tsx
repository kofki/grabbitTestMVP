import React, { useCallback } from 'react';
import { Text, View, Button, Keyboard, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { db } from '@/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import GroupRequests from '@/components/GroupRequests';
import FriendsGroup from '@/components/FriendsGroup';


export default function GroupScreen() {
    const router = useRouter();
    const { group, groupName, members_id: rawMembersId } = useLocalSearchParams<{group: string, groupName: string, members_id: string | string[]}>();
    const members_id = Array.isArray(rawMembersId) ? rawMembersId : [rawMembersId];
    const [members_name, setMembersName] = React.useState<any[]>([]);

    useFocusEffect(useCallback(() => {
        for (let i = 0; i < members_id.length; i++) {
        const memberNameRef = ref(db, 'users/' + members_id[i] + '/username');
        onValue(memberNameRef, (snapshot) => {
            if (snapshot.exists()) {
                setMembersName((prev) => [...prev, snapshot.val()]);
            }
        })
    }
        return () => {
        }

    }, []))
    return (
        <ScrollView onScroll={()=> Keyboard.dismiss()} keyboardShouldPersistTaps="handled" scrollEventThrottle={10}>
            <FriendsGroup friends={members_name}/>
            <GroupRequests friends={members_name} group_id={group}/>
        </ScrollView>
    );
}