import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  FormControl,
  FormLabel,
  Input,
  Box,
  Text,
  FormErrorMessage,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { RegisterationSuccessNotification } from "~/notifications/notifications";
import { zodResolver } from "@hookform/resolvers/zod";
import { PublishUpdateSchema } from "~/schemas/zodSchema";

type publicApiFormInputs = {
  publishedTitle: string;
  publishedStrategy: string;
};

export const EndOfBattleModal = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { id } = router.query;

  const initialRef = useRef(null);

  // useStateを使ってフォームのデータを管理
  const [formData, setFormData] = useState<publicApiFormInputs>({
    publishedTitle: "",
    publishedStrategy: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // フォームのデフォルトの送信動作を防ぐ

    console.log(formData,"送ったデータ");

    setIsSubmitting(true);
    
    try {
      const response = await axios.put(
        `http://localhost:3000/api/tasks/${id}`,
        {
          isPublished: true,
          ...formData,
        }
      );

      console.log(response.data, "これがレスポンス内容よ！");

      await router.push("/");
      RegisterationSuccessNotification();
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <>
        <Modal closeOnOverlayClick={false} initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />

          <form onSubmit={onSubmit}>
          <ModalContent>
            {/* (略) その他のコンテンツはそのまま */}
            <ModalBody pb={6}>
              {/* (略) テキストコンテンツはそのまま */}
              
              <FormControl>
                <FormLabel>公開するモンスターの名前</FormLabel>
                <Input
                  type="text"
                  name="publishedTitle"
                  value={formData.publishedTitle}
                  onChange={handleChange}
                  ref={initialRef}
                  placeholder="例）やっと継続3日目のシャドーイング練習"
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>倒し方のコツ</FormLabel>
                <Input
                  type="text"
                  name="publishedStrategy"
                  value={formData.publishedStrategy}
                  onChange={handleChange}
                  placeholder="ロールモデルが喋るYoutubeを題材にする！"
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                loadingText="送信中です"
                isLoading={isSubmitting}
                type="submit"
              >
                討伐内容を公開する
              </Button>

              <Button onClick={onClose}>今回は公開しない</Button>
            </ModalFooter>
          </ModalContent>
          </form>
        </Modal>

        <Toaster />
    </>
  );
};