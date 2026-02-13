import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { useData } from "./DataContext";
import ManualAddForm, { ManualAddFormProps } from "./components/ManualAddForm";
import SubmissionStatus from "./components/SubmissionStatus";
import BackButton from "./components/buttons/BackButton";
import AddHeader from "./components/headers/AddHeader";

export default function Add() {
  const { id } = useLocalSearchParams(); // Used for the update version of the function
  const { calculateDaysTilExp } = useData();
  const [name, setName] = useState("");
  const [moveTo, setMoveTo] = useState<1 | 2 | 3 | null>(null);
  const [daysTilExp, setDaysTilExp] = useState<string>("0");
  const [actionSuccessful, setActionSuccessful] = useState<
    boolean | undefined
  >();

  // Controls if the user is updating or adding an item for the first time
  const [editMode, setEditMode] = useState(false);

  const { handleSubmit, handleUpdate, getItemById } = useData();

  // Checks if the id exists, which determines if we're in "edit mode"
  useEffect(() => {
    if (id) {
      setEditMode(true);
      (async () => {
        const item = await getItemById(parseInt(id as string));
        if (
          item &&
          (item.location_id == 1 ||
            item.location_id == 2 ||
            item.location_id == 3)
        ) {
          setName(item.name);
          setMoveTo(item.location_id);
          setDaysTilExp(calculateDaysTilExp(item.expiration_date).toString());
        }
      })();
    }
  }, [id, getItemById, calculateDaysTilExp]);

  // Clears values on new load of the page/screen
  useFocusEffect(
    useCallback(() => {
      return () => {
        setName("");
        setMoveTo(null);
        setDaysTilExp("0");
      };
    }, []),
  );

  function actionIsSuccessful() {
    setActionSuccessful(true);
  }

  function actionNotSuccessful() {
    setActionSuccessful(false);
  }

  // Has behavior for failed submission AFTER param checks
  async function submitCheckedParams() {
    if (editMode && id) {
      await handleUpdate(
        parseInt(id as string),
        name,
        moveTo!,
        daysTilExp,
        actionIsSuccessful,
        actionNotSuccessful,
      );
    } else {
      await handleSubmit(
        [{ name, locationId: moveTo!, daysTilExp }],
        actionIsSuccessful,
        actionNotSuccessful,
      );
    }

    setTimeout(() => {
      // just until the text-recognizer library works
      router.back();
    }, 1000);
  }

  // Presubmit checks for bad parameters
  const onSubmit = async () => {
    if (name.trim() === "" || daysTilExp.trim() === "" || moveTo === null) {
      Alert.alert("Please fill out each field.");
      return;
    }
    try {
      parseInt(daysTilExp);
    } catch (error) {
      Alert.alert(
        "Please make sure the 'Days Until Expiration' field is a number",
      );
      return;
    }
    submitCheckedParams();
  };

  const myProps: ManualAddFormProps = {
    updateName: setName,
    daysTilExpState: { daysTilExp, setDaysTilExp },
    editModeState: { editMode, setEditMode },
    submit: onSubmit,
    moveToState: { moveTo, setMoveTo },
  };

  // Acutal component
  return (
    <TouchableWithoutFeedback
      onPress={() => Keyboard.dismiss()}
      accessible={false}
    >
      <View className="flex-1 relative">
        <AddHeader />
        <View className="h-full min-h-screen flex-1 justify-start items-center">
          <View className="bg-white p-6 mt-10 rounded-md w-4/5 ">
            {actionSuccessful === undefined ? (
              <ManualAddForm props={myProps} />
            ) : (
              <SubmissionStatus isSuccess={actionSuccessful} />
            )}
          </View>
        </View>
        <BackButton />
      </View>
    </TouchableWithoutFeedback>
  );
}
