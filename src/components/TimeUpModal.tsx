import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Select,
} from "@chakra-ui/react";
import axios from "axios";
import { NextRouter, Router, useRouter } from "next/router";
import { useState } from "react";

type TimeUpModalProps = {
  isOpen: boolean;
  onClose: () => void;
  id:string;
};

export const TimeUpModal = ({ isOpen, onClose,id }: TimeUpModalProps) => {
  const [time, setTime] = useState(5);
  const router = useRouter()
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setTime(parseInt(value, 10));
    console.log(time, "追加する時間")
  };
  const handleSubmit = async () => {
    console.log(time,"延長時のTime")
    console.log(id,"延長時のTaskのID")

    try {
        const response = await axios.put(
          `http://localhost:3000/api/tasks/${id}`,
          {
            isOnGoing: true, 
            remainingMinutes: time,
          }
        );
        console.log(response.data, "これが分数追加時のデータ");
       
        onClose();
        router.reload()
        
      } catch (error) {
        console.error("Error updating totalminutes of task:", error);
      }
   
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>時間切れです！</ModalHeader>
        <ModalBody>
          設定した時間が終了しました！あと何分で倒せそうですか？
          <Select onChange={handleChange}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="30">30</option>
            <option value="45">45</option>
            <option value="60">60</option>
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            {time}分だけ延長する
          </Button>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            一度諦める
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
